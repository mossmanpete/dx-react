import TruffleContract from 'truffle-contract'

const contractNames = [
  'DutchExchange',
  'DutchExchangeETHGNO',
  'DutchExchangeGNOETH',
  'Token',
  'TokenETH',
  'TokenGNO',
]

type ContractName = 'DutchExchange' |
  'DutchExchangeETHGNO' |
  'DutchExchangeGNOETH' |
  'Token' |
  'TokenETH' |
  'TokenGNO'

type ContractsMap = {[P in ContractName]: object}

const Contracts = contractNames.map(name => TruffleContract(require(`../../build/contracts/${name}.json`)))

// name => contract mapping
export const contractsMap = contractNames.reduce((acc, name, i) => {
  acc[name] = Contracts[i]
  return acc
}, {}) as ContractsMap

export const setProvider = (provider: any) => Contracts.forEach((contract) => {
  contract.setProvider(provider)
})

const promisedInstances = Promise.all(Contracts.map(contr => contr.deployed()))

export const promisedContractsMap = init()

async function init() {
  const instances = await promisedInstances

  // name => contract instance mapping
  // e.g. TokenETH => deployed TokenETH contract
  return contractNames.reduce((acc, name, i) => {
    acc[name] = instances[i]
    return acc
  }, {}) as ContractsMap
}
