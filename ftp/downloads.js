const config = {
    owner: 'WoodcraftWorld',
    repo: 'Downloads',
    branch: 'master'
};

const browserEl = document.getElementById('browser');
const backBtn = document.getElementById('backBtn');
let currentPath = '';
function initPathFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const pathParam = params.get('path');
    if (pathParam) {
        currentPath = pathParam;
    }
}
function updateUrlPath() {
    const params = new URLSearchParams(window.location.search);
    params.set('path', currentPath);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
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
    updateUrlPath();

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

initPathFromUrl();
fetchRepoContents(currentPath);