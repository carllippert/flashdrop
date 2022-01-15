// Check for MetaMask wallet browser extension
function hasMetamask () {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

export { hasMetamask }
