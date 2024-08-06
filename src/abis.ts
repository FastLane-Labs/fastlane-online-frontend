import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Atlas - FastlaneOnline
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const FastlaneOnlineAbi = [
  {
    inputs: [{ internalType: 'address', name: '_atlas', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'AlteredControl', type: 'error' },
  { inputs: [], name: 'BaselineFailFailure', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'baselineAmount', type: 'uint256' }],
    name: 'BaselineFailSuccessful',
    type: 'error',
  },
  { inputs: [], name: 'BothPreOpsAndUserReturnDataCannotBeTracked', type: 'error' },
  { inputs: [], name: 'BothUserAndDAppNoncesCannotBeSequential', type: 'error' },
  { inputs: [], name: 'FLOnlineControl_PostOps_BalanceOfFailed1', type: 'error' },
  { inputs: [], name: 'FLOnlineControl_PostOps_BalanceOfFailed2', type: 'error' },
  { inputs: [], name: 'FLOnlineControl_PostOps_BaselineCallFailed', type: 'error' },
  { inputs: [], name: 'FLOnlineControl_PostOps_ReserveNotMet', type: 'error' },
  { inputs: [], name: 'FLOnlineControl_PreSolver_BidBelowReserve', type: 'error' },
  { inputs: [], name: 'FLOnlineControl_PreSolver_BuyTokenMismatch', type: 'error' },
  { inputs: [], name: 'FLOnlineControl_PreSolver_SellTokenMismatch', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_BaselineSwapWrapper_BalanceOfFailed1', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_BaselineSwapWrapper_BalanceOfFailed2', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_BaselineSwapWrapper_BaselineCallFailed', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_BaselineSwapWrapper_CallerIsNotAtlas', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_BaselineSwapWrapper_IncorrectPhase', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_BaselineSwapWrapper_NoBalanceIncrease', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_BaselineSwapWrapper_NotActiveEnv', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_Swap_BuyAndSellTokensAreSame', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_Swap_ControlNotBundler', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_Swap_ControlNotUser', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_Swap_MustBeDelegated', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_Swap_OnlyAtlas', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_Swap_SellFundsUnavailable', type: 'error' },
  { inputs: [], name: 'FLOnlineInner_Swap_UserNotLocked', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_FastOnlineSwap_UserOpHashMismatch', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_ValidateSwap_BuyTokenZeroAddress', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_ValidateSwap_DeadlinePassed', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_ValidateSwap_GasLimitTooLow', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_ValidateSwap_InvalidGasPrice', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_ValidateSwap_SellTokenZeroAddress', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_ValidateSwap_TxGasTooHigh', type: 'error' },
  { inputs: [], name: 'FLOnlineOuter_ValidateSwap_TxGasTooLow', type: 'error' },
  { inputs: [], name: 'InvalidControl', type: 'error' },
  { inputs: [], name: 'InvalidSolver', type: 'error' },
  { inputs: [], name: 'InvertBidValueCannotBeExPostBids', type: 'error' },
  { inputs: [], name: 'MustBeDelegatecalled', type: 'error' },
  { inputs: [], name: 'NoDelegatecall', type: 'error' },
  { inputs: [], name: 'NotImplemented', type: 'error' },
  { inputs: [], name: 'OnlyAtlas', type: 'error' },
  { inputs: [], name: 'OnlyGovernance', type: 'error' },
  { inputs: [], name: 'SolverGateway_AddSolverOp_ValueTooLow', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_BidTooLow', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_BondedTooLow', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_BuyTokenMismatch', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_BuyTokenZeroAddress', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_DeadlineInvalid', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_DeadlinePassed', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_DoubleSolve', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_InvalidControl', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_InvalidSolverGasPrice', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_MsgSenderIsNotSolver', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_SellTokenMismatch', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_SellTokenZeroAddress', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_SolverGasTooHigh', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_Unverified', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_UserGasTooLow', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_UserOpHashMismatch_Nonce', type: 'error' },
  { inputs: [], name: 'SolverGateway_PreValidateSolverOp_UserOpHashMismatch_Solver', type: 'error' },
  { inputs: [], name: 'SolverGateway_RefundCongestionBuyIns_DeadlineNotPassed', type: 'error' },
  { inputs: [], name: 'Unauthorized', type: 'error' },
  { inputs: [], name: 'WrongPhase', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousGovernance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newGovernance', type: 'address' },
    ],
    name: 'GovernanceTransferStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousGovernance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newGovernance', type: 'address' },
    ],
    name: 'GovernanceTransferred',
    type: 'event',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'ATLAS',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ATLAS_VERIFICATION',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'CALL_CONFIG',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'CONTROL',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_SOLVER_GAS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SOURCE',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'S_aggCongestionBuyIn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'S_congestionBuyIn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'S_solverOpCache',
    outputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'gas', type: 'uint256' },
      { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'address', name: 'solver', type: 'address' },
      { internalType: 'address', name: 'control', type: 'address' },
      { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
      { internalType: 'address', name: 'bidToken', type: 'address' },
      { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'S_solverOpHashes',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'S_userNonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USER_GAS_BUFFER',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'acceptGovernance', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenUserBuys', type: 'address' },
          { internalType: 'uint256', name: 'minAmountUserBuys', type: 'uint256' },
          { internalType: 'address', name: 'tokenUserSells', type: 'address' },
          { internalType: 'uint256', name: 'amountUserSells', type: 'uint256' },
        ],
        internalType: 'struct SwapIntent',
        name: 'swapIntent',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bool', name: 'success', type: 'bool' },
        ],
        internalType: 'struct BaselineCall',
        name: 'baselineCall',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint256', name: 'gas', type: 'uint256' },
      { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
      { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
      { internalType: 'address', name: 'swapper', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
    ],
    name: 'addSolverOp',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'bidToken', type: 'address' },
      { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'allocateValueCall',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenUserBuys', type: 'address' },
          { internalType: 'uint256', name: 'minAmountUserBuys', type: 'uint256' },
          { internalType: 'address', name: 'tokenUserSells', type: 'address' },
          { internalType: 'uint256', name: 'amountUserSells', type: 'uint256' },
        ],
        internalType: 'struct SwapIntent',
        name: 'swapIntent',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bool', name: 'success', type: 'bool' },
        ],
        internalType: 'struct BaselineCall',
        name: 'baselineCall',
        type: 'tuple',
      },
    ],
    name: 'baselineSwapWrapper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    type: 'function',
    name: 'fastOnlineSwap',
    inputs: [
      {
        name: 'userOp',
        type: 'tuple',
        internalType: 'struct UserOperation',
        components: [
          {
            name: 'from',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'to',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gas',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxFeePerGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'nonce',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'dapp',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'control',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'callConfig',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'sessionKey',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'signature',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getBidAmount',
    inputs: [
      {
        name: 'solverOpHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'bidAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
    ],
    name: 'getBidFormat',
    outputs: [{ internalType: 'address', name: 'bidToken', type: 'address' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
    ],
    name: 'getBidValue',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCallConfig',
    outputs: [
      {
        components: [
          { internalType: 'bool', name: 'userNoncesSequential', type: 'bool' },
          { internalType: 'bool', name: 'dappNoncesSequential', type: 'bool' },
          { internalType: 'bool', name: 'requirePreOps', type: 'bool' },
          { internalType: 'bool', name: 'trackPreOpsReturnData', type: 'bool' },
          { internalType: 'bool', name: 'trackUserReturnData', type: 'bool' },
          { internalType: 'bool', name: 'delegateUser', type: 'bool' },
          { internalType: 'bool', name: 'requirePreSolver', type: 'bool' },
          { internalType: 'bool', name: 'requirePostSolver', type: 'bool' },
          { internalType: 'bool', name: 'requirePostOps', type: 'bool' },
          { internalType: 'bool', name: 'zeroSolvers', type: 'bool' },
          { internalType: 'bool', name: 'reuseUserOp', type: 'bool' },
          { internalType: 'bool', name: 'userAuctioneer', type: 'bool' },
          { internalType: 'bool', name: 'solverAuctioneer', type: 'bool' },
          { internalType: 'bool', name: 'unknownAuctioneer', type: 'bool' },
          { internalType: 'bool', name: 'verifyCallChainHash', type: 'bool' },
          { internalType: 'bool', name: 'forwardReturnData', type: 'bool' },
          { internalType: 'bool', name: 'requireFulfillment', type: 'bool' },
          { internalType: 'bool', name: 'trustedOpHash', type: 'bool' },
          { internalType: 'bool', name: 'invertBidValue', type: 'bool' },
          { internalType: 'bool', name: 'exPostBids', type: 'bool' },
          { internalType: 'bool', name: 'allowAllocateValueFailure', type: 'bool' },
        ],
        internalType: 'struct CallConfig',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
    ],
    name: 'getDAppConfig',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint32', name: 'solverGasLimit', type: 'uint32' },
        ],
        internalType: 'struct DAppConfig',
        name: 'dConfig',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDAppSignatory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'getNextUserNonce',
    outputs: [{ internalType: 'uint256', name: 'nonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSolverGasLimit',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUser',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'swapper', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'tokenUserBuys', type: 'address' },
          { internalType: 'uint256', name: 'minAmountUserBuys', type: 'uint256' },
          { internalType: 'address', name: 'tokenUserSells', type: 'address' },
          { internalType: 'uint256', name: 'amountUserSells', type: 'uint256' },
        ],
        internalType: 'struct SwapIntent',
        name: 'swapIntent',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bool', name: 'success', type: 'bool' },
        ],
        internalType: 'struct BaselineCall',
        name: 'baselineCall',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint256', name: 'gas', type: 'uint256' },
      { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
    ],
    name: 'getUserOperation',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'governance',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingGovernance',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: 'solved', type: 'bool' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'postOpsCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'returnData', type: 'bytes' },
    ],
    name: 'postSolverCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
    ],
    name: 'preOpsCall',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'returnData', type: 'bytes' },
    ],
    name: 'preSolverCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
    ],
    name: 'refundCongestionBuyIns',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'requireSequentialDAppNonces',
    outputs: [{ internalType: 'bool', name: 'isSequential', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'requireSequentialUserNonces',
    outputs: [{ internalType: 'bool', name: 'isSequential', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'swapper', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'tokenUserBuys', type: 'address' },
          { internalType: 'uint256', name: 'minAmountUserBuys', type: 'uint256' },
          { internalType: 'address', name: 'tokenUserSells', type: 'address' },
          { internalType: 'uint256', name: 'amountUserSells', type: 'uint256' },
        ],
        internalType: 'struct SwapIntent',
        name: 'swapIntent',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bool', name: 'success', type: 'bool' },
        ],
        internalType: 'struct BaselineCall',
        name: 'baselineCall',
        type: 'tuple',
      },
    ],
    name: 'swap',
    outputs: [
      { internalType: 'address', name: '', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'tokenUserBuys', type: 'address' },
          { internalType: 'uint256', name: 'minAmountUserBuys', type: 'uint256' },
          { internalType: 'address', name: 'tokenUserSells', type: 'address' },
          { internalType: 'uint256', name: 'amountUserSells', type: 'uint256' },
        ],
        internalType: 'struct SwapIntent',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bool', name: 'success', type: 'bool' },
        ],
        internalType: 'struct BaselineCall',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newGovernance', type: 'address' }],
    name: 'transferGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'userDelegated',
    outputs: [{ internalType: 'bool', name: 'delegated', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
]

export const atlasAbi = [
  {
    inputs: [
      { internalType: 'uint256', name: 'escrowDuration', type: 'uint256' },
      { internalType: 'address', name: 'verification', type: 'address' },
      { internalType: 'address', name: 'simulator', type: 'address' },
      { internalType: 'address', name: 'initialSurchargeRecipient', type: 'address' },
      { internalType: 'address', name: 'l2GasCalculator', type: 'address' },
      { internalType: 'address', name: 'executionTemplate', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'AllocateValueDelegatecallFail', type: 'error' },
  { inputs: [], name: 'AllocateValueFail', type: 'error' },
  { inputs: [], name: 'AllocateValueSimFail', type: 'error' },
  { inputs: [], name: 'AlreadyInitialized', type: 'error' },
  { inputs: [], name: 'AlteredControl', type: 'error' },
  { inputs: [], name: 'AtlasLockActive', type: 'error' },
  { inputs: [], name: 'BalanceNotReconciled', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'bidAmount', type: 'uint256' }],
    name: 'BidFindSuccessful',
    type: 'error',
  },
  { inputs: [], name: 'BidNotPaid', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'indexInSolverOps', type: 'uint256' },
      { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
    ],
    name: 'BidTooHigh',
    type: 'error',
  },
  { inputs: [], name: 'BothPreOpsAndUserReturnDataCannotBeTracked', type: 'error' },
  { inputs: [], name: 'BothUserAndDAppNoncesCannotBeSequential', type: 'error' },
  { inputs: [], name: 'CallbackNotCalled', type: 'error' },
  { inputs: [], name: 'DAppNotEnabled', type: 'error' },
  { inputs: [], name: 'DoubleReconcile', type: 'error' },
  { inputs: [], name: 'EnvironmentMismatch', type: 'error' },
  { inputs: [], name: 'EscrowLockActive', type: 'error' },
  { inputs: [], name: 'ExecutionEnvironmentBalanceTooLow', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'actual', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
    ],
    name: 'InsufficientAtlETHBalance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
    ],
    name: 'InsufficientAvailableBalance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
    ],
    name: 'InsufficientBalanceForDeduction',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
    ],
    name: 'InsufficientBondedBalance',
    type: 'error',
  },
  { inputs: [], name: 'InsufficientEscrow', type: 'error' },
  { inputs: [], name: 'InsufficientFunds', type: 'error' },
  { inputs: [], name: 'InsufficientLocalFunds', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'actual', type: 'uint256' },
      { internalType: 'uint256', name: 'msgValue', type: 'uint256' },
      { internalType: 'uint256', name: 'holds', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
    ],
    name: 'InsufficientSolverBalance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
    ],
    name: 'InsufficientSurchargeBalance',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'shortfall', type: 'uint256' }],
    name: 'InsufficientTotalBalance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
    ],
    name: 'InsufficientUnbondedBalance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
    ],
    name: 'InsufficientWithdrawableBalance',
    type: 'error',
  },
  { inputs: [], name: 'InvalidAccess', type: 'error' },
  { inputs: [], name: 'InvalidCaller', type: 'error' },
  { inputs: [], name: 'InvalidCodeHash', type: 'error' },
  { inputs: [], name: 'InvalidControl', type: 'error' },
  { inputs: [], name: 'InvalidDAppControl', type: 'error' },
  { inputs: [], name: 'InvalidEntry', type: 'error' },
  { inputs: [], name: 'InvalidEntryFunction', type: 'error' },
  { inputs: [], name: 'InvalidEnvironment', type: 'error' },
  { inputs: [], name: 'InvalidEscrowDuration', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'correctEnvironment', type: 'address' }],
    name: 'InvalidExecutionEnvironment',
    type: 'error',
  },
  { inputs: [], name: 'InvalidLockState', type: 'error' },
  { inputs: [], name: 'InvalidSignatory', type: 'error' },
  { inputs: [], name: 'InvalidSigner', type: 'error' },
  { inputs: [], name: 'InvalidSolver', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'solverFrom', type: 'address' }],
    name: 'InvalidSolverFrom',
    type: 'error',
  },
  { inputs: [], name: 'InvalidTo', type: 'error' },
  { inputs: [], name: 'InvalidUser', type: 'error' },
  { inputs: [], name: 'InvertBidValueCannotBeExPostBids', type: 'error' },
  { inputs: [], name: 'InvertedBidExceedsCeiling', type: 'error' },
  { inputs: [{ internalType: 'uint8', name: 'id', type: 'uint8' }], name: 'LedgerBalancing', type: 'error' },
  { inputs: [{ internalType: 'uint8', name: 'id', type: 'uint8' }], name: 'LedgerFinalized', type: 'error' },
  { inputs: [{ internalType: 'uint8', name: 'id', type: 'uint8' }], name: 'MissingFunds', type: 'error' },
  { inputs: [], name: 'MustBeDelegatecalled', type: 'error' },
  { inputs: [], name: 'NoAuctionWinner', type: 'error' },
  { inputs: [], name: 'NoDelegatecall', type: 'error' },
  { inputs: [], name: 'NoUnfilledRequests', type: 'error' },
  { inputs: [], name: 'NoUnusedNonceInBitmap', type: 'error' },
  { inputs: [], name: 'NotEnvironmentOwner', type: 'error' },
  { inputs: [], name: 'NotImplemented', type: 'error' },
  { inputs: [], name: 'NotInitialized', type: 'error' },
  { inputs: [], name: 'OnlyAtlas', type: 'error' },
  { inputs: [], name: 'OnlyGovernance', type: 'error' },
  { inputs: [], name: 'PermitDeadlineExpired', type: 'error' },
  { inputs: [], name: 'PostOpsDelegatecallFail', type: 'error' },
  { inputs: [], name: 'PostOpsDelegatecallReturnedFalse', type: 'error' },
  { inputs: [], name: 'PostOpsFail', type: 'error' },
  { inputs: [], name: 'PostOpsSimFail', type: 'error' },
  { inputs: [], name: 'PostSolverFailed', type: 'error' },
  { inputs: [], name: 'PreOpsDelegatecallFail', type: 'error' },
  { inputs: [], name: 'PreOpsFail', type: 'error' },
  { inputs: [], name: 'PreOpsSimFail', type: 'error' },
  { inputs: [], name: 'PreSolverFailed', type: 'error' },
  { inputs: [], name: 'SignatoryActive', type: 'error' },
  { inputs: [], name: 'SimulationPassed', type: 'error' },
  { inputs: [], name: 'SolverMustReconcile', type: 'error' },
  { inputs: [], name: 'SolverOpReverted', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'solverOutcomeResult', type: 'uint256' }],
    name: 'SolverSimFail',
    type: 'error',
  },
  { inputs: [], name: 'Unauthorized', type: 'error' },
  { inputs: [], name: 'UnbalancedAccounting', type: 'error' },
  { inputs: [], name: 'UncoveredResult', type: 'error' },
  { inputs: [], name: 'UnexpectedNonRevert', type: 'error' },
  { inputs: [], name: 'Unreachable', type: 'error' },
  { inputs: [], name: 'UserNotFulfilled', type: 'error' },
  { inputs: [], name: 'UserOpFail', type: 'error' },
  { inputs: [], name: 'UserOpSimFail', type: 'error' },
  { inputs: [], name: 'UserOpValueExceedsBalance', type: 'error' },
  { inputs: [], name: 'UserSimulationFailed', type: 'error' },
  { inputs: [], name: 'UserSimulationSucceeded', type: 'error' },
  { inputs: [], name: 'UserUnexpectedSuccess', type: 'error' },
  { inputs: [], name: 'UserWrapperCallFail', type: 'error' },
  { inputs: [], name: 'UserWrapperDelegatecallFail', type: 'error' },
  { inputs: [{ internalType: 'enum ValidCallsResult', name: '', type: 'uint8' }], name: 'ValidCalls', type: 'error' },
  { inputs: [], name: 'ValueTooLarge', type: 'error' },
  {
    inputs: [{ internalType: 'enum ValidCallsResult', name: '', type: 'uint8' }],
    name: 'VerificationSimFail',
    type: 'error',
  },
  { inputs: [], name: 'WrongDepth', type: 'error' },
  { inputs: [], name: 'WrongPhase', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Bond',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'governance', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'DAppDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'oldGovernance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newGovernance', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'DAppGovernanceChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'executionEnvironment', type: 'address' },
    ],
    name: 'ExecutionEnvironmentCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousGovernance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newGovernance', type: 'address' },
    ],
    name: 'GovernanceTransferStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousGovernance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newGovernance', type: 'address' },
    ],
    name: 'GovernanceTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'bundler', type: 'address' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'solverSuccessful', type: 'bool' },
      { indexed: false, internalType: 'bool', name: 'disbursementSuccessful', type: 'bool' },
      { indexed: false, internalType: 'uint256', name: 'ethPaidToBundler', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'netGasSurcharge', type: 'uint256' },
    ],
    name: 'MetacallResult',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'governance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'signatory', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'NewDAppSignatory',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Redeem',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'governance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'signatory', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'RemovedDAppSignatory',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'solverTo', type: 'address' },
      { indexed: true, internalType: 'address', name: 'solverFrom', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'executed', type: 'bool' },
      { indexed: false, internalType: 'bool', name: 'success', type: 'bool' },
      { indexed: false, internalType: 'uint256', name: 'result', type: 'uint256' },
    ],
    name: 'SolverTxResult',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'currentRecipient', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newRecipient', type: 'address' },
    ],
    name: 'SurchargeRecipientTransferStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'newRecipient', type: 'address' }],
    name: 'SurchargeRecipientTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'SurchargeWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'earliestAvailable', type: 'uint256' },
    ],
    name: 'Unbond',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ATLAS_SURCHARGE_RATE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BUNDLER_SURCHARGE_RATE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ESCROW_DURATION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'EXECUTION_ENV_TEMPLATE',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FIXED_GAS_OFFSET',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'L2_GAS_CALCULATOR',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SCALE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SIMULATOR',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERIFICATION',
    outputs: [{ internalType: 'contract IAtlasVerification', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'accessData',
    outputs: [
      { internalType: 'uint112', name: 'bonded', type: 'uint112' },
      { internalType: 'uint32', name: 'lastAccessedBlock', type: 'uint32' },
      { internalType: 'uint24', name: 'auctionWins', type: 'uint24' },
      { internalType: 'uint24', name: 'auctionFails', type: 'uint24' },
      { internalType: 'uint64', name: 'totalGasUsed', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'accountLastActiveBlock',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOfBonded',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOfUnbonding',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'becomeSurchargeRecipient', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'bond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bondedTotalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'borrow',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  { inputs: [], name: 'contribute', outputs: [], stateMutability: 'payable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'control', type: 'address' }],
    name: 'createExecutionEnvironment',
    outputs: [{ internalType: 'address', name: 'executionEnvironment', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cumulativeSurcharge',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: 'amountToBond', type: 'uint256' }],
    name: 'depositAndBond',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint32', name: 'solverGasLimit', type: 'uint32' },
        ],
        internalType: 'struct DAppConfig',
        name: 'dConfig',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation[]',
        name: 'solverOps',
        type: 'tuple[]',
      },
      { internalType: 'address', name: 'executionEnvironment', type: 'address' },
      { internalType: 'address', name: 'bundler', type: 'address' },
      { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'executionEnvironment', type: 'address' },
          { internalType: 'uint24', name: 'solverOutcome', type: 'uint24' },
          { internalType: 'uint8', name: 'solverIndex', type: 'uint8' },
          { internalType: 'uint8', name: 'solverCount', type: 'uint8' },
          { internalType: 'uint8', name: 'callDepth', type: 'uint8' },
          { internalType: 'uint8', name: 'phase', type: 'uint8' },
          { internalType: 'bool', name: 'solverSuccessful', type: 'bool' },
          { internalType: 'bool', name: 'paymentsSuccessful', type: 'bool' },
          { internalType: 'bool', name: 'bidFind', type: 'bool' },
          { internalType: 'bool', name: 'isSimulation', type: 'bool' },
          { internalType: 'address', name: 'bundler', type: 'address' },
        ],
        internalType: 'struct Context',
        name: 'ctx',
        type: 'tuple',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'control', type: 'address' },
    ],
    name: 'getExecutionEnvironment',
    outputs: [
      { internalType: 'address', name: 'executionEnvironment', type: 'address' },
      { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
      { internalType: 'bool', name: 'exists', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isUnlocked',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lock',
    outputs: [
      { internalType: 'address', name: 'activeEnvironment', type: 'address' },
      { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
      { internalType: 'uint8', name: 'phase', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation[]',
        name: 'solverOps',
        type: 'tuple[]',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'address', name: 'bundler', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'bytes32', name: 'callChainHash', type: 'bytes32' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct DAppOperation',
        name: 'dAppOp',
        type: 'tuple',
      },
    ],
    name: 'metacall',
    outputs: [{ internalType: 'bool', name: 'auctionWon', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingSurchargeRecipient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'maxApprovedGasSpend', type: 'uint256' }],
    name: 'reconcile',
    outputs: [{ internalType: 'uint256', name: 'owed', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'redeem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'shortfall',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'executionEnvironment', type: 'address' },
          { internalType: 'uint24', name: 'solverOutcome', type: 'uint24' },
          { internalType: 'uint8', name: 'solverIndex', type: 'uint8' },
          { internalType: 'uint8', name: 'solverCount', type: 'uint8' },
          { internalType: 'uint8', name: 'callDepth', type: 'uint8' },
          { internalType: 'uint8', name: 'phase', type: 'uint8' },
          { internalType: 'bool', name: 'solverSuccessful', type: 'bool' },
          { internalType: 'bool', name: 'paymentsSuccessful', type: 'bool' },
          { internalType: 'bool', name: 'bidFind', type: 'bool' },
          { internalType: 'bool', name: 'isSimulation', type: 'bool' },
          { internalType: 'address', name: 'bundler', type: 'address' },
        ],
        internalType: 'struct Context',
        name: 'ctx',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
      { internalType: 'bytes', name: 'returnData', type: 'bytes' },
    ],
    name: 'solverCall',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'floor', type: 'uint256' },
          { internalType: 'uint256', name: 'ceiling', type: 'uint256' },
          { internalType: 'bool', name: 'etherIsBidToken', type: 'bool' },
          { internalType: 'bool', name: 'invertsBidValue', type: 'bool' },
        ],
        internalType: 'struct SolverTracker',
        name: 'solverTracker',
        type: 'tuple',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'solverLockData',
    outputs: [
      { internalType: 'address', name: 'currentSolver', type: 'address' },
      { internalType: 'bool', name: 'calledBack', type: 'bool' },
      { internalType: 'bool', name: 'fulfilled', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'opHash', type: 'bytes32' }],
    name: 'solverOpHashes',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'surchargeRecipient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'destination', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'control', type: 'address' },
    ],
    name: 'transferDAppERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newRecipient', type: 'address' }],
    name: 'transferSurchargeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'destination', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'control', type: 'address' },
    ],
    name: 'transferUserERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'unbond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'unbondingCompleteBlock',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'withdrawSurcharge', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { stateMutability: 'payable', type: 'receive' },
]

export const atlasVerificationAbi = [
  {
    inputs: [{ internalType: 'address', name: 'atlas', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'AtlasLockActive', type: 'error' },
  { inputs: [], name: 'DAppNotEnabled', type: 'error' },
  { inputs: [], name: 'InvalidCaller', type: 'error' },
  { inputs: [], name: 'InvalidSignatory', type: 'error' },
  { inputs: [], name: 'OnlyGovernance', type: 'error' },
  { inputs: [], name: 'SignatoryActive', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'governance', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'DAppDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'oldGovernance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newGovernance', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'DAppGovernanceChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'governance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'signatory', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'NewDAppSignatory',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'control', type: 'address' },
      { indexed: true, internalType: 'address', name: 'governance', type: 'address' },
      { indexed: true, internalType: 'address', name: 'signatory', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'callConfig', type: 'uint32' },
    ],
    name: 'RemovedDAppSignatory',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ATLAS',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'control', type: 'address' },
      { internalType: 'address', name: 'signatory', type: 'address' },
    ],
    name: 'addSignatory',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'oldGovernance', type: 'address' },
      { internalType: 'address', name: 'newGovernance', type: 'address' },
    ],
    name: 'changeDAppGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'dAppSequentialNonceTrackers',
    outputs: [{ internalType: 'uint256', name: 'lastUsedSeqNonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'control', type: 'address' }],
    name: 'dAppSignatories',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'control', type: 'address' }],
    name: 'disableDApp',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'dApp', type: 'address' }],
    name: 'getDAppNextNonce',
    outputs: [{ internalType: 'uint256', name: 'nextNonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'address', name: 'bundler', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'bytes32', name: 'callChainHash', type: 'bytes32' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct DAppOperation',
        name: 'dAppOp',
        type: 'tuple',
      },
    ],
    name: 'getDAppOperationPayload',
    outputs: [{ internalType: 'bytes32', name: 'payload', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [{ internalType: 'bytes32', name: 'domainSeparator', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'control', type: 'address' }],
    name: 'getGovFromControl',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
    ],
    name: 'getSolverPayload',
    outputs: [{ internalType: 'bytes32', name: 'payload', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'refNonce', type: 'uint256' },
    ],
    name: 'getUserNextNonSeqNonceAfter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bool', name: 'sequential', type: 'bool' },
    ],
    name: 'getUserNextNonce',
    outputs: [{ internalType: 'uint256', name: 'nextNonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
    ],
    name: 'getUserOperationHash',
    outputs: [{ internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
    ],
    name: 'getUserOperationPayload',
    outputs: [{ internalType: 'bytes32', name: 'payload', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'control', type: 'address' }],
    name: 'initializeGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'control', type: 'address' },
      { internalType: 'address', name: 'signatory', type: 'address' },
    ],
    name: 'isDAppSignatory',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'control', type: 'address' },
      { internalType: 'address', name: 'signatory', type: 'address' },
    ],
    name: 'removeSignatory',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'key', type: 'bytes32' }],
    name: 'signatories',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint248', name: 'wordIndex', type: 'uint248' },
    ],
    name: 'userNonSequentialNonceTrackers',
    outputs: [{ internalType: 'uint256', name: 'bitmap', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'userSequentialNonceTrackers',
    outputs: [{ internalType: 'uint256', name: 'lastUsedSeqNonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint32', name: 'solverGasLimit', type: 'uint32' },
        ],
        internalType: 'struct DAppConfig',
        name: 'dConfig',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'dapp', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'uint32', name: 'callConfig', type: 'uint32' },
          { internalType: 'address', name: 'sessionKey', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation[]',
        name: 'solverOps',
        type: 'tuple[]',
      },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'address', name: 'bundler', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'bytes32', name: 'callChainHash', type: 'bytes32' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct DAppOperation',
        name: 'dAppOp',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'msgValue', type: 'uint256' },
      { internalType: 'address', name: 'msgSender', type: 'address' },
      { internalType: 'bool', name: 'isSimulation', type: 'bool' },
    ],
    name: 'validateCalls',
    outputs: [{ internalType: 'enum ValidCallsResult', name: '', type: 'uint8' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint32', name: 'callConfig', type: 'uint32' }],
    name: 'verifyCallConfig',
    outputs: [{ internalType: 'enum ValidCallsResult', name: '', type: 'uint8' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'gas', type: 'uint256' },
          { internalType: 'uint256', name: 'maxFeePerGas', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'address', name: 'solver', type: 'address' },
          { internalType: 'address', name: 'control', type: 'address' },
          { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
          { internalType: 'address', name: 'bidToken', type: 'address' },
          { internalType: 'uint256', name: 'bidAmount', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct SolverOperation',
        name: 'solverOp',
        type: 'tuple',
      },
      { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
      { internalType: 'uint256', name: 'userMaxFeePerGas', type: 'uint256' },
      { internalType: 'address', name: 'bundler', type: 'address' },
      { internalType: 'bool', name: 'allowsTrustedOpHash', type: 'bool' },
    ],
    name: 'verifySolverOp',
    outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721Abi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'ERC721InvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: 'function',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: 'remaining', type: 'uint256' }],
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  { type: 'error', inputs: [{ name: 'sender', internalType: 'address', type: 'address' }], name: 'ERC20InvalidSender' },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'ERC721InvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721MetadataAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Receiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ReceiverAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mathAbi = [{ type: 'error', inputs: [], name: 'MathOverflowedMulDiv' }] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Message
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const messageAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'purpose', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'SetMessage',
  },
  {
    type: 'function',
    inputs: [],
    name: 'message',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_message', internalType: 'string', type: 'string' }],
    name: 'setMessage',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const messageAddress = {
  11155111: '0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const messageConfig = { address: messageAddress, abi: messageAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NexthFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const nexthFtAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'ERC721InvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableAbi = [
  { type: 'error', inputs: [{ name: 'owner', internalType: 'address', type: 'address' }], name: 'OwnableInvalidOwner' },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'function', inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Strings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stringsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc165Abi}__
 */
export const readErc165 = /*#__PURE__*/ createReadContract({ abi: erc165Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc165SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: erc165Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const readErc721 = /*#__PURE__*/ createReadContract({ abi: erc721Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc721BalanceOf = /*#__PURE__*/ createReadContract({ abi: erc721Abi, functionName: 'balanceOf' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const readErc721GetApproved = /*#__PURE__*/ createReadContract({ abi: erc721Abi, functionName: 'getApproved' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readErc721IsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"name"`
 */
export const readErc721Name = /*#__PURE__*/ createReadContract({ abi: erc721Abi, functionName: 'name' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const readErc721OwnerOf = /*#__PURE__*/ createReadContract({ abi: erc721Abi, functionName: 'ownerOf' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc721SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc721Symbol = /*#__PURE__*/ createReadContract({ abi: erc721Abi, functionName: 'symbol' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"tokenURI"`
 */
export const readErc721TokenUri = /*#__PURE__*/ createReadContract({ abi: erc721Abi, functionName: 'tokenURI' })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const writeErc721 = /*#__PURE__*/ createWriteContract({ abi: erc721Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc721Approve = /*#__PURE__*/ createWriteContract({ abi: erc721Abi, functionName: 'approve' })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeErc721SafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeErc721SetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc721TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const simulateErc721 = /*#__PURE__*/ createSimulateContract({ abi: erc721Abi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc721Approve = /*#__PURE__*/ createSimulateContract({ abi: erc721Abi, functionName: 'approve' })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateErc721SafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateErc721SetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc721TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__
 */
export const watchErc721Event = /*#__PURE__*/ createWatchContractEvent({ abi: erc721Abi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc721ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchErc721ApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc721TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc165Abi}__
 */
export const readIerc165 = /*#__PURE__*/ createReadContract({ abi: ierc165Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIerc165SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: ierc165Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721Abi}__
 */
export const readIerc721 = /*#__PURE__*/ createReadContract({ abi: ierc721Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc721BalanceOf = /*#__PURE__*/ createReadContract({ abi: ierc721Abi, functionName: 'balanceOf' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const readIerc721GetApproved = /*#__PURE__*/ createReadContract({ abi: ierc721Abi, functionName: 'getApproved' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readIerc721IsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: ierc721Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const readIerc721OwnerOf = /*#__PURE__*/ createReadContract({ abi: ierc721Abi, functionName: 'ownerOf' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIerc721SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: ierc721Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721Abi}__
 */
export const writeIerc721 = /*#__PURE__*/ createWriteContract({ abi: ierc721Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"approve"`
 */
export const writeIerc721Approve = /*#__PURE__*/ createWriteContract({ abi: ierc721Abi, functionName: 'approve' })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeIerc721SafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeIerc721SetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: ierc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeIerc721TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721Abi}__
 */
export const simulateIerc721 = /*#__PURE__*/ createSimulateContract({ abi: ierc721Abi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"approve"`
 */
export const simulateIerc721Approve = /*#__PURE__*/ createSimulateContract({ abi: ierc721Abi, functionName: 'approve' })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateIerc721SafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ierc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateIerc721SetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: ierc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateIerc721TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ierc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721Abi}__
 */
export const watchIerc721Event = /*#__PURE__*/ createWatchContractEvent({ abi: ierc721Abi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721Abi}__ and `eventName` set to `"Approval"`
 */
export const watchIerc721ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc721Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchIerc721ApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc721Abi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchIerc721TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc721Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__
 */
export const readIerc721Metadata = /*#__PURE__*/ createReadContract({ abi: ierc721MetadataAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc721MetadataBalanceOf = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"getApproved"`
 */
export const readIerc721MetadataGetApproved = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readIerc721MetadataIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"name"`
 */
export const readIerc721MetadataName = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"ownerOf"`
 */
export const readIerc721MetadataOwnerOf = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIerc721MetadataSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"symbol"`
 */
export const readIerc721MetadataSymbol = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"tokenURI"`
 */
export const readIerc721MetadataTokenUri = /*#__PURE__*/ createReadContract({
  abi: ierc721MetadataAbi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721MetadataAbi}__
 */
export const writeIerc721Metadata = /*#__PURE__*/ createWriteContract({ abi: ierc721MetadataAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const writeIerc721MetadataApprove = /*#__PURE__*/ createWriteContract({
  abi: ierc721MetadataAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeIerc721MetadataSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc721MetadataAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeIerc721MetadataSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: ierc721MetadataAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeIerc721MetadataTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc721MetadataAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721MetadataAbi}__
 */
export const simulateIerc721Metadata = /*#__PURE__*/ createSimulateContract({ abi: ierc721MetadataAbi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const simulateIerc721MetadataApprove = /*#__PURE__*/ createSimulateContract({
  abi: ierc721MetadataAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateIerc721MetadataSafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ierc721MetadataAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateIerc721MetadataSetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: ierc721MetadataAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateIerc721MetadataTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ierc721MetadataAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721MetadataAbi}__
 */
export const watchIerc721MetadataEvent = /*#__PURE__*/ createWatchContractEvent({ abi: ierc721MetadataAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `eventName` set to `"Approval"`
 */
export const watchIerc721MetadataApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc721MetadataAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchIerc721MetadataApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc721MetadataAbi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc721MetadataAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchIerc721MetadataTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc721MetadataAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__
 */
export const writeIerc721Receiver = /*#__PURE__*/ createWriteContract({ abi: ierc721ReceiverAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const writeIerc721ReceiverOnErc721Received = /*#__PURE__*/ createWriteContract({
  abi: ierc721ReceiverAbi,
  functionName: 'onERC721Received',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__
 */
export const simulateIerc721Receiver = /*#__PURE__*/ createSimulateContract({ abi: ierc721ReceiverAbi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const simulateIerc721ReceiverOnErc721Received = /*#__PURE__*/ createSimulateContract({
  abi: ierc721ReceiverAbi,
  functionName: 'onERC721Received',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link messageAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const readMessage = /*#__PURE__*/ createReadContract({ abi: messageAbi, address: messageAddress })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link messageAbi}__ and `functionName` set to `"message"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const readMessageMessage = /*#__PURE__*/ createReadContract({
  abi: messageAbi,
  address: messageAddress,
  functionName: 'message',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link messageAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const writeMessage = /*#__PURE__*/ createWriteContract({ abi: messageAbi, address: messageAddress })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link messageAbi}__ and `functionName` set to `"setMessage"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const writeMessageSetMessage = /*#__PURE__*/ createWriteContract({
  abi: messageAbi,
  address: messageAddress,
  functionName: 'setMessage',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link messageAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const simulateMessage = /*#__PURE__*/ createSimulateContract({ abi: messageAbi, address: messageAddress })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link messageAbi}__ and `functionName` set to `"setMessage"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const simulateMessageSetMessage = /*#__PURE__*/ createSimulateContract({
  abi: messageAbi,
  address: messageAddress,
  functionName: 'setMessage',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link messageAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const watchMessageEvent = /*#__PURE__*/ createWatchContractEvent({ abi: messageAbi, address: messageAddress })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link messageAbi}__ and `eventName` set to `"SetMessage"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xF11f180eE37dd6aa7dD08b8C1Cd670fC4DBE0e34)
 */
export const watchMessageSetMessageEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: messageAbi,
  address: messageAddress,
  eventName: 'SetMessage',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__
 */
export const readNexthFt = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readNexthFtBalanceOf = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi, functionName: 'balanceOf' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"getApproved"`
 */
export const readNexthFtGetApproved = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi, functionName: 'getApproved' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readNexthFtIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: nexthFtAbi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"name"`
 */
export const readNexthFtName = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi, functionName: 'name' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"owner"`
 */
export const readNexthFtOwner = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi, functionName: 'owner' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"ownerOf"`
 */
export const readNexthFtOwnerOf = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi, functionName: 'ownerOf' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readNexthFtSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: nexthFtAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"symbol"`
 */
export const readNexthFtSymbol = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi, functionName: 'symbol' })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"tokenURI"`
 */
export const readNexthFtTokenUri = /*#__PURE__*/ createReadContract({ abi: nexthFtAbi, functionName: 'tokenURI' })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__
 */
export const writeNexthFt = /*#__PURE__*/ createWriteContract({ abi: nexthFtAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"approve"`
 */
export const writeNexthFtApprove = /*#__PURE__*/ createWriteContract({ abi: nexthFtAbi, functionName: 'approve' })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeNexthFtRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: nexthFtAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"safeMint"`
 */
export const writeNexthFtSafeMint = /*#__PURE__*/ createWriteContract({ abi: nexthFtAbi, functionName: 'safeMint' })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeNexthFtSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: nexthFtAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeNexthFtSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: nexthFtAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeNexthFtTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: nexthFtAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeNexthFtTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: nexthFtAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__
 */
export const simulateNexthFt = /*#__PURE__*/ createSimulateContract({ abi: nexthFtAbi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"approve"`
 */
export const simulateNexthFtApprove = /*#__PURE__*/ createSimulateContract({ abi: nexthFtAbi, functionName: 'approve' })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateNexthFtRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nexthFtAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"safeMint"`
 */
export const simulateNexthFtSafeMint = /*#__PURE__*/ createSimulateContract({
  abi: nexthFtAbi,
  functionName: 'safeMint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateNexthFtSafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: nexthFtAbi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateNexthFtSetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: nexthFtAbi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateNexthFtTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: nexthFtAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link nexthFtAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateNexthFtTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: nexthFtAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nexthFtAbi}__
 */
export const watchNexthFtEvent = /*#__PURE__*/ createWatchContractEvent({ abi: nexthFtAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nexthFtAbi}__ and `eventName` set to `"Approval"`
 */
export const watchNexthFtApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nexthFtAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nexthFtAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchNexthFtApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nexthFtAbi,
  eventName: 'ApprovalForAll',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nexthFtAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchNexthFtOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nexthFtAbi,
  eventName: 'OwnershipTransferred',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nexthFtAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchNexthFtTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: nexthFtAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const readOwnable = /*#__PURE__*/ createReadContract({ abi: ownableAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"owner"`
 */
export const readOwnableOwner = /*#__PURE__*/ createReadContract({ abi: ownableAbi, functionName: 'owner' })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const writeOwnable = /*#__PURE__*/ createWriteContract({ abi: ownableAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeOwnableRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: ownableAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeOwnableTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: ownableAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const simulateOwnable = /*#__PURE__*/ createSimulateContract({ abi: ownableAbi })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateOwnableRenounceOwnership = /*#__PURE__*/ createSimulateContract({
  abi: ownableAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateOwnableTransferOwnership = /*#__PURE__*/ createSimulateContract({
  abi: ownableAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableAbi}__
 */
export const watchOwnableEvent = /*#__PURE__*/ createWatchContractEvent({ abi: ownableAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchOwnableOwnershipTransferredEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ownableAbi,
  eventName: 'OwnershipTransferred',
})
