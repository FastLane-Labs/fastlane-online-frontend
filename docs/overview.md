# BoomerSwap Frontend Overview

BoomerSwap Frontend is an implementation of the first fully decentralised and on-chain intent-based Request for Quote (RFQ) system. Built with React and the Atlas SDK, this frontend leverages the Atlas framework to provide a seamless and efficient token swapping experience on EVM-compatible blockchain networks with a public mempool.

## Atlas Framework

Atlas is a permissionless and modular smart contract framework for Execution Abstraction. It provides applications and frontends with an auction system in which Solvers compete to provide optimal solutions for user intents or MEV redistribution. A User Operation is collected by the app's frontend via the Atlas SDK and sent to an app-designated bundler, which combines it with Solver Operations into a single transaction.

## Key Features

1. **Intent-Based Swaps**: Utilizes Atlas's auction system to find optimal solutions for user swap intents.

2. **Solver Competition**: Leverages multiple Solvers to compete in providing the best execution for user operations.

3. **User-Friendly Interface**: Intuitive design allowing users to easily input swap intents and execute trades.

4. **Wallet Integration**: Seamless connection with popular Web3 wallets for secure transaction signing and balance management.

5. **Real-Time Quotes**: Fetches and displays up-to-date swap quotes from a fallback router or aggregator, and has solvers compete to offer users price improvement on the swap.

6. **Transaction Monitoring**: Provides real-time updates on the status of ongoing and past transactions.

7. **Responsive Design**: Optimized for both desktop and mobile devices, ensuring a consistent experience across platforms.

8. **Customizable Settings**: Allows users to adjust parameters for personalized trading preferences.

9. **Network Flexibility**: Supports multiple EVM-compatible networks, with clear network information and switching capabilities.

## Architecture Overview

- **Atlas SDK Integration**: Utilizes the Atlas SDK to interact with the Atlas framework for intent creation.
- **Component-Based Structure**: Employs a modular React component architecture for maintainability and reusability.
- **Service Abstraction**: Implements service layers for handling User Operations, Solver interactions, and blockchain communications.
- **State Management**: Employs efficient state management techniques to handle complex application states and data flow.
- **Theming Support**: Includes light and dark mode themes for user comfort in various environments.

Atlas-RFQ Frontend aims to showcase the power of intent-based trading using the Atlas framework, providing a seamless, efficient, and secure token swapping experience that leverages competition among Solvers to achieve optimal execution for users.

## System Components

### Off Chain Component Interactions

```mermaid
sequenceDiagram
    autonumber
    participant Browser
    participant Wallet
    participant RPC
    participant P2P
    participant Searchers
    participant Validator

    Validator ->> P2P: listen for transactions
    Searchers ->> P2P: listen for transactions

    Browser ->> RPC: view call to retrieve baseline quote
    Browser ->> Browser: create user bundled transaction <br/>with SwapIntent and BaselineQuote
    Browser ->> Wallet: sign user bundled transaction

    Browser ->> RPC: submit signed transaction
    RPC ->> P2P: gossip transaction
    Browser ->> RPC: listen for transaction receipt

    loop Searcher loop
        Note right of P2P: Different searchers compete through the<br/>P2P in a PGA to find the winning solution<br/>of the users swap intent.
        P2P -->> Searchers: user transaction or solver<br/>frontrun transaction
        Searchers ->> Searchers: find solution
        Searchers ->> P2P: submit signed solver<br/>frontrun transaction
    end

    Validator ->> Validator: build block
    Validator ->> P2P: gossip block

    RPC ->> Browser: transaction receipt
```

### On-chain Component Interactions

```mermaid
sequenceDiagram
    title FastLane Online Onchain Flow

    participant UserEOA
    participant SolverEOA
    participant SolverContract
    participant FastLaneControl
    participant Atlas
    participant ExEnv

    Note over UserEOA,ExEnv: Tx 1: User Permits Atlas

    autonumber
    UserEOA->>+FastLaneControl: permit token to be sold

    Note over UserEOA,ExEnv: Tx 2: Solver frontruns user to register their solution
    autonumber
    SolverEOA->>+SolverContract: call some userdata
    SolverContract->>+FastLaneControl: register SolverOp for UserOp
    FastLaneControl->>-SolverContract: OK
    SolverContract->>-SolverEOA: OK

    Note over UserEOA,ExEnv: Tx 3: Users signed SwapIntent is handled by FastLaneControl
    autonumber
    UserEOA->>+FastLaneControl: call fastOnlineSwap(UserOperation)
    FastLaneControl->>FastLaneControl: transfer from user to control
    UserEOA-->>FastLaneControl: TokensUserSells

    Note over FastLaneControl: control loads solverOp registered in 1.1 and uses it to create a bundle

    FastLaneControl->>+Atlas: call metacall(Bundle)
    Atlas->>+ExEnv: call userWrapper(userOp)
    ExEnv->>+FastLaneControl: delegatecall swap(SwapIntent, BaselineCall)

    Note over FastLaneControl: re-calculate the Baseline Call expected output amount using current on-chain data

    FastLaneControl->>FastLaneControl: transfer TokensUserSells to exenv
    FastLaneControl->>ExEnv: ReturnData
    FastLaneControl-->>ExEnv: TokensUserSells

    ExEnv->>-Atlas: UserReturnData
    Atlas->>Atlas: bidFindingIteration

    loop until solver successful
        Atlas->>+ExEnv: call solverPreTryCatch(solverOp)
        ExEnv->>+FastLaneControl: delegatecall preSolverCall
        FastLaneControl->>FastLaneControl: optimistically transfer sold tokens to solver
        ExEnv-->>SolverContract: TokensUserSells
        FastLaneControl->>ExEnv: OK
        ExEnv->>-Atlas: OK
    end

    Atlas->>+SolverContract: call atlasSolverCall(solverOp)

    Note over SolverContract: solver fulfills the intent somehow

    SolverContract->>SolverContract: transfer bought tokens to user
    SolverContract-->>ExEnv: TokensUserBuys
    SolverContract->>-Atlas: OK

    Atlas->>+ExEnv: call allocateValue(bidAmount, returnData)
    ExEnv->>ExEnv: transfer TokensUserBuys to user
    ExEnv-->>UserEOA: TokensUserBuys

    Atlas->>+ExEnv: call postOpsWrapper(solved, returnData)
    ExEnv->>+FastLaneControl: delegatecall postOpsCall(solved, data)

    Note over FastLaneControl: if a solver fulfills the intent, then this does nothing. otherwise, it will attempt to fulfill the user intent using the baseline call that was provided along with the intent.

    FastLaneControl->>ExEnv: OK
    ExEnv->>-Atlas: OK
    Atlas->>-FastLaneControl: OK
    FastLaneControl->>-UserEOA: OK
```

## Platform

The DApp will be deployed as a set of static assets on CloudFlare Pages, with no backend dependency other than RPC interaction through a users connected wallet.

```mermaid
graph TD
  WebBrowser --> DNS
  WebBrowser --> WAF
  WAF --> Pages
```

### Requirements

* CloudFlare Pages must be configured to block connections from any US citizens using the WAF.

## DevOps

CloudFlare Pages supports the concept of branch based deployments from GitHub, where the app is deployed to a named environment for each branch. We will use a standard [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)-like branching model with a `main` and `develop` branch, and feature branches as necessary.

Branching structure will look like:

```mermaid
graph LR
feature --> develop
develop --> main
```

## React Component Overview

```mermaid
graph TD
    GP[GlobalProvider] --> A[App]
    A --> B[Header]
    A --> C[MainContent]
    A --> D[Footer]
    GP -.-> U[TransactionStatusService]
    GP -.-> DD[NetworkConfigService]

    B --> E[WalletConnector]
    B --> F[NotificationOverview]
    B --> H[NetworkInfo]
    B --> I[ThemeToggle]

    F --> T[NotificationEvent]

    C --> G[AtlasRFQCore]

    G --> J[SwapInterface]
    G -.-> V[BaseSwapService]
    G -.-> W[TokenPriceService]
    G -.-> R[TokenProviderService]

    J --> L[TabNavigation]
    J --> M[SwapPanel]
    J --> N[SettingsButton]
    J --> O[Logo]

    N --> K[SettingsModal]
    M --> P[TokenInputPanel From]
    M --> Q[TokenInputPanel To]
    M --> S[SwapButton]

    P --> T1[TokenInput]
    P --> T2[TokenSelector]
    P --> T3[TokenBalance]
    P --> T4[MaxButton]

    Q --> U1[TokenInput]
    Q --> U2[TokenSelector]

    V --> X[IBaseSwapProvider]
    X --> Y[UniswapProvider]

    R --> S1[ITokenProvider]
    S1 --> AA[ConfigFileTokenProvider]

    D --> BB[VersionField]
    D --> CC[Network Logo]

    style A fill:#f9f,stroke:#333,stroke-width:4px
    style GP fill:#ffcccc,stroke:#333,stroke-width:2px
    style G fill:#ccf,stroke:#333,stroke-width:2px
    style V fill:#e6e6fa,stroke:#333,stroke-width:2px
    style W fill:#e6e6fa,stroke:#333,stroke-width:2px
    style R fill:#e6e6fa,stroke:#333,stroke-width:2px
    style U fill:#e6e6fa,stroke:#333,stroke-width:2px
    style DD fill:#e6e6fa,stroke:#333,stroke-width:2px
    style X fill:#d8f0d8,stroke:#333,stroke-width:2px
    style S1 fill:#d8f0d8,stroke:#333,stroke-width:2px
    style Y fill:#fdd,stroke:#333,stroke-width:2px
    style AA fill:#fdd,stroke:#333,stroke-width:2px

    classDef swapInterfaceText fill:#0fff,color:#000000,font-weight:bold
    class J swapInterfaceText

    classDef atlasRFQCoreText fill:#0fff,color:#000000,font-weight:bold
    class G atlasRFQCoreText

    classDef interfacesText fill:#dadb95,color:#000000,font-weight:bold
    class S1,X interfacesText

    classDef providerText fill:#c28894,color:#000000,font-weight:bold
    class Y,Z,AA providerText

    classDef serviceText fill:#eef075,color:#677387,font-weight:bold
    class V,W,R,U,DD serviceText

    classDef globalProviderText fill:#ffcccc,color:#000000,font-weight:bold
    class GP globalProviderText
```

## Atlas-RFQ Frontend Service Component Breakdown

### GlobalProvider

Functionality:
* Provides a global state management for the application
* Handles wallet connection and network configuration

Responsibilities:
* Provide a global state management for the application
* Handles wallet connection and network configuration

### TransactionStatusService

Functionality:
* Monitors the status of submitted transactions
* Provides access to past transaction statuses
* Registers monitor jobs for newly submitted transactions

Responsibilities:
* Keep track of all user transactions
* Update transaction statuses in real-time
* Persist transaction statuses for historical reference
* Notify other components (e.g., NotificationOverview) of status changes

### BaseSwapService

Functionality:
* Interfaces with specific decentralized exchanges (DEXes) such as Uniswap and Quickswap
* Retrieves baseline quotes for token swaps

Responsibilities:
* Implement the IBaseSwapProvider interface
* Manage connections to different DEX providers (e.g., UniswapV2Provider, UniswapV3Provider, QuickswapProvider)
* Fetch real-time baseline quotes based on user input
* Construct and manage multicall requests for efficient quote retrieval
* Handle quote-related errors and edge cases
* Provide a standardized quote format regardless of the underlying DEX

### TokenPriceService

Functionality:
* Fetches and manages token price data
* Provides up-to-date price information for supported tokens

Responsibilities:
* Regularly update token prices (e.g., every 2-3 minutes)
* Cache price data to reduce API calls
* Convert token amounts to their USD equivalent
* Handle network issues and API failures gracefully

### TokenProviderService

Functionality:
* Manages the list of supported tokens
* Provides token metadata and balance information

Responsibilities:
* Implement the ITokenProvider interface
* Load token list from a configuration file (ConfigFileTokenProvider)
* Fetch token balances for connected wallets
* Provide methods to search and filter tokens
* Keep token metadata (symbol, name, decimals, etc.) up to date

### Atlas SDK Integration

Functionality:
* Integrates the Atlas SDK capabilities into the frontend application
* Manages the core interactions between the frontend and the Atlas framework

Responsibilities:
1. User Operation Creation:
   * Generate user operations based on swap intents input by users
   * Handle necessary signing and validation of user operations

### useWalletConnection Hook

Functionality:
* Manages wallet connections and interactions using a wallet connection library (e.g., wagmi, Web3Modal, or RainbowKit)

Responsibilities:
* Provide a simple interface for connecting and disconnecting wallets
* Expose connected account information and network details
* Handle network switching requests
* Offer methods for transaction signing, including Atlas-specific operations
* Manage wallet connection state

### NetworkConfigService

Functionality:
* Stores and provides access to network-specific configurations for Atlas-RFQ Frontend

Responsibilities:
* Maintain a mapping of supported network configurations, including:
  - Multicall contract addresses
  - Atlas contract addresses
  - Chain IDs
* Provide methods to retrieve configuration details for the current or a specified network
* Update configuration details when necessary (e.g., contract address changes)

Implementation Notes:
* Implemented as a simple service or context provider
* Does not handle network switching or detection (managed by wallet connection library)
* Coordinates with the Atlas SDK to ensure consistent network configurations