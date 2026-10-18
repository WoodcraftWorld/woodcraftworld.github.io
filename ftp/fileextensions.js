function getIconUrl(fileName, isDir) {
    if (isDir) return 'folder.ico';

    const extArr = fileName.split('.');
    const extArr2 = extArr;
    let ext=extArr2.pop().toLowerCase();
    //alert(fileName+','+extArr.length+','+extArr[1]+','+ext);
    if(extArr.length==2){
        ext = extArr[1].toLowerCase();
        //alert(1);
    } else {
        
    }
    
    
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
        case 'mpg':  return 'video.ico';
        case 'avi':  return 'video.ico';
        case 'ts' :  return 'video.ico';
        case 'mts':  return 'video.ico';
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
        case 'gz':   return 'zip.ico';
        case 'tar.gz':return'zip.ico';
        case 'tar':  return 'zip.ico';
        case 'jpg':  return 'image.ico';
        case 'png':  return 'image.ico';
        case 'jpe':  return 'image.ico';
        case 'apk':  return 'apk.ico';
        case 'ipa':  return 'ipa.ico';
        case 'swf':  return 'swf.ico';
        case 'stl':  return '3d.ico';
        case 'glb':  return '3d.ico';
        case 'obj':  return '3d.ico';
        case 'blend':return '3d.ico';
        case 'osk':  return 'osu.ico';
        case 'osr':  return 'osu.ico';
        case 'osz':  return 'osu.ico';
        case 'olz':  return 'osu.ico';
        case '3gp':  return 'video.ico';
        case 'amr':  return 'audio.ico'
        case 'mcworld': return 'minecraft.ico';
        case 'mcpack' : return 'minecraft.ico';
        case 'mcaddon': return 'minecraft.ico';
        case 'torrent': return 'torrent.ico';
        default:     return 'unknown.ico';
    }
}
