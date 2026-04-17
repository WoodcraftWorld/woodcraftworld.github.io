const config = {
    owner: 'WoodcraftWorld',
    repo: 'Downloads',
    branch: 'master'
};

const browserEl = document.getElementById('browser');
const backBtn = document.getElementById('backBtn');
let currentPath = '';

function getIconUrl(fileName, isDir) {
    if (isDir) return 'folder.ico';

    const ext = fileName.split('.').pop().toLowerCase();
    
    switch(ext) {
        case 'bat':  return 'bat.ico';
        case 'exe':  return 'bat.ico';
        case 'html': return 'html.ico';
        case 'htm':  return 'html.ico';
        case 'iso':  return 'iso.ico';
        case 'dmg':  return 'iso.ico';
        case 'js':   return 'js.ico';
        case 'txt':  return 'txt.ico';
        case 'mp4':  return 'video.ico';
        case 'wmv':  return 'video.ico';
        case 'mov':  return 'quicktime.ico';
        case 'aac':  return 'quicktime.ico';
        case 'm4v':  return 'quicktime.ico';
        case 'm4a':  return 'quicktime.ico';
        case 'mp3':  return 'audio.ico';
        case 'wma':  return 'audio.ico';
        case 'opus': return 'audio.ico';
        case 'ogg':  return 'audio.ico';
        case 'aiff': return 'audio.ico';
        case 'wav':  return 'audio.ico';
        case 'pdf':  return 'pdf.ico';
        case 'zip':  return 'zip.ico';
        case '7z':   return 'zip.ico';
        case 'rar':  return 'zip.ico';
        case 'jpg':  return 'image.ico';
        case 'png':  return 'image.ico';
        case 'jpe':  return 'image.ico';
        case 'apk':  return 'apk.ico';
        case 'ipa':  return 'ipa.ico';
        case 'swf':  return 'swf.ico';
        default:     return 'unknown.ico';
    }
}

async function fetchRepoContents(path = '') {
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderFiles(data);
    } catch (error) {
        alert("API Error:", error);
    }
}

function renderFiles(files) {
    browserEl.innerHTML = '';
    backBtn.style.display = currentPath ? 'block' : 'none';

    files.forEach(file => {
        const li = document.createElement('li');
        const isDir = file.type === 'dir';
        const ext = file.name.split('.').pop().toLowerCase();
        const iconSrc = getIconUrl(file.name, isDir);
            li.innerHTML = `
            <span class="icon">
                <img src="${iconSrc}" 
                     width="32" 
                     height="32" 
                     onerror="this.src='unknown.ico';">
            </span>
            <span class="file-name">${file.name}</span>
        `;
        
        if(file.name == "external_page.html"){
            const pagesUrl = `https://${config.owner}.github.io/${config.repo}/${file.path}`;
                window.open(pagesUrl, '_blank');
        }

        li.onclick = () => {
            if (isDir) {
                currentPath = file.path;
                fetchRepoContents(file.path);
            } else {
                
                const pagesUrl = `https://${config.owner}.github.io/${config.repo}/${file.path}`;
                window.open(pagesUrl, '_blank');
            }
        };
        if(ext!="md"){
        browserEl.appendChild(li);
        }
    });
}

backBtn.onclick = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    currentPath = pathParts.join('/');
    fetchRepoContents(currentPath);
};

fetchRepoContents();