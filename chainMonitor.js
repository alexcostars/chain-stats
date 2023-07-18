const fs = require('fs')
const Web3 = require('web3').default
let web3 = new Web3('https://rpc.ankr.com/eth')

const outputDir = './output';
if(!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

async function getData(outputFile, firstIteration = true) {
    let output = ''
    if(firstIteration) {
        output = String('#block').padStart(15) + ' | ' + String('qtdTxs').padStart(6) + ' | ' + String('blockTime').padStart(9) + ' | ' + 'Datetime\n'
    }
    try {
        var latestBlock = await web3.eth.getBlock('latest')
        const blockNumber = latestBlock.number
        const previousBlock = await web3.eth.getBlock(BigInt(blockNumber) - BigInt(1))
        
        const blockTransactions = latestBlock.transactions.length
        const blockTime = latestBlock.timestamp - previousBlock.timestamp
   
        output += String(blockNumber).padStart(15) + ' | ' + String(blockTransactions).padStart(6) + ' | ' + String(String(blockTime) + 's').padStart(9) + ' | ' + String(new Date()).substring(4, 25)
        
    } catch(e) {
        output += 'connection error: ' + e
    }
    
    fs.writeFileSync(outputFile, output + '\n', {encoding: 'utf8', flag: 'a+', mode: 0o666})
    console.log(output)

    setTimeout(() => {
        getData(outputFile, false)
    }, 1000)
}

getData(outputDir + '/output_' + Date.now() + '.txt')
