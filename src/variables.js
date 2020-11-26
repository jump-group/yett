export const TYPE_ATTRIBUTE = 'javascript/blocked'

export const patterns = {
    blacklist: window.YETT_BLACKLIST,
    whitelist: window.YETT_WHITELIST
}

// Backup list containing the original blacklisted script elements
export const backupScripts = {
    blacklisted: []
}

// Backup list containing the original blacklisted iframe elements
export const backupIframes = {
    blacklisted: []
}