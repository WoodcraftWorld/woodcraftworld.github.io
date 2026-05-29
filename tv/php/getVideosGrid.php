<?php
define('SECURE_ACCESS', true);
$getApiKey = include('getApiKey.php');
$apiKey = $getApiKey['api_key'];
$channelId = 'UCvoJYr0-T39igg86YjqiluQ';
$cacheFile = 'cache_videos.json';
$cacheTime = 3600; 

if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTime)) {
    $data = json_decode(file_get_contents($cacheFile), true);
} else {
    // Fetch videos
    $url = "https://www.googleapis.com/youtube/v3/search?" . http_build_query([
        'part' => 'snippet',
        'channelId' => $channelId,
        'type' => 'video',
        'order' => 'date',
        'maxResults' => 20, // Increased to account for filtered VODs
        'key' => $apiKey
    ]);

    $response = @file_get_contents($url);
    $searchData = json_decode($response, true);
    $data = [];

    if (!empty($searchData['items'])) {
        $videoIds = [];
        $tempData = [];

        foreach ($searchData['items'] as $item) {
            // CRITICAL FILTER: 
            // 'none' means it's a standard upload. 
            // If it was a livestream, the search API often returns 'upcoming' or 'live'.
            // However, to strictly ignore VODs, we also check if the 'snippet' 
            // contains 'live' markers.
            if ($item['snippet']['liveBroadcastContent'] === 'none') {
                $vId = $item['id']['videoId'];
                $videoIds[] = $vId;
                $tempData[$vId] = [
                    'title' => $item['snippet']['title'],
                    'thumb' => $item['snippet']['thumbnails']['high']['url'],
                    'date'  => date('M j, Y', strtotime($item['snippet']['publishedAt'])),
                    'link'  => "https://www.youtube.com/watch?v=$vId"
                ];
            }
        }

        if (!empty($videoIds)) {
            $idList = implode(',', $videoIds);
            $detailsUrl = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails,liveStreamingDetails&id=$idList&key=$apiKey";
            $detailsResponse = json_decode(file_get_contents($detailsUrl), true);
            
            foreach ($detailsResponse['items'] as $v) {
                // SECONDARY FILTER:
                // If 'liveStreamingDetails' exists, it was a Livestream (VOD).
                // We only want to keep it if this block is missing.
                if (!isset($v['liveStreamingDetails'])) {
                    $interval = new DateInterval($v['contentDetails']['duration']);
                    $tempData[$v['id']]['duration'] = $interval->format('%H:%I:%S');
                    $data[] = $tempData[$v['id']];
                }
            }
        }
    }
    file_put_contents($cacheFile, json_encode($data));
}
?>

<style>
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; font-family: sans-serif; }
    .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; text-decoration: none; color: #000; transition: 0.2s; }
    .card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
    .info { padding: 12px; }
    .meta { font-size: 0.85em; color: #666; margin-top: 5px; }
</style>

<div class="grid">
    <?php if (!empty($data)): ?>
        <?php foreach ($data as $item): ?>
            <a href="<?= $item['link'] ?>" class="card" target="_blank">
                <img src="<?= $item['thumb'] ?>">
                <div class="info">
                    <strong><?= htmlspecialchars($item['title']) ?></strong>
                    <div class="meta"><?= $item['duration'] ?> • <?= $item['date'] ?></div>
                </div>
            </a>
        <?php endforeach; ?>
    <?php else: ?>
        <p>No regular videos found.</p>
    <?php endif; ?>
</div>