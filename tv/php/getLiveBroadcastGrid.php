<?php
define('SECURE_ACCESS', true);
$getApiKey = include('getApiKey.php');
$apiKey = $getApiKey['api_key'];
$channelId = 'UCvoJYr0-T39igg86YjqiluQ';
$cacheFile = 'cache_vods.json';
$cacheTime = 3600; 

if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTime)) {
    $data = json_decode(file_get_contents($cacheFile), true);
} else {
    // 1. Fetch the list of completed livestreams
    $url = "https://www.googleapis.com/youtube/v3/search?" . http_build_query([
        'part' => 'snippet',
        'channelId' => $channelId,
        'eventType' => 'completed',
        'type' => 'video',
        'order' => 'date',
        'maxResults' => 12,
        'key' => $apiKey
    ]);

    $response = @file_get_contents($url);
    $searchData = json_decode($response, true);
    $data = [];

    if (!empty($searchData['items'])) {
        // Collect Video IDs cleanly
        $videoIds = [];
        foreach ($searchData['items'] as $item) {
            $videoIds[] = $item['id']['videoId'];
        }

        // 2. Fetch durations for those IDs
        $idList = implode(',', $videoIds);
        $detailsUrl = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=$idList&key=$apiKey";
        $detailsResponse = json_decode(file_get_contents($detailsUrl), true);
        
        $durations = [];
        foreach ($detailsResponse['items'] as $v) {
            $interval = new DateInterval($v['contentDetails']['duration']);
            $durations[$v['id']] = $interval->format('%H:%I:%S');
        }

        // 3. Assemble the final data array
        foreach ($searchData['items'] as $item) {
            $vId = $item['id']['videoId'];
            $data[] = [
                'title' => $item['snippet']['title'],
                'thumb' => $item['snippet']['thumbnails']['high']['url'],
                'date'  => date('M j, Y', strtotime($item['snippet']['publishedAt'])),
                'duration' => $durations[$vId] ?? '--:--',
                'link'  => "https://www.youtube.com/watch?v=$vId"
            ];
        }
    }
    
    // Save to cache
    file_put_contents($cacheFile, json_encode($data));
}
?>

<style>
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; font-family: sans-serif; }
    .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; text-decoration: none; color: #000; transition: 0.2s; }
    .card:hover { border-color: #aaa; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
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
        <p>No livestreams found.</p>
    <?php endif; ?>
</div>