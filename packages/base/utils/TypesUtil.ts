import type { CaipNetwork, ThemeVariables } from '@web3modal/common'
import type {
  ChainAdapter,
  NetworkControllerState,
  OptionsControllerState,
  ThemeMode,
  Token
} from '@web3modal/core'
import type { SIWEControllerClient, Web3ModalSIWEClient } from '@web3modal/siwe'

export type AppKitOptions = OptionsControllerState & {
  /**
   * Adapter array to be used by the AppKit.
   * @default []
   */
  adapters?: ChainAdapter[]
  /**
   * Sign In With Ethereum configuration object.
   * @default undefined
   * @see https://docs.walletconnect.com/appkit/react/core/siwe#configure-your-siwe-client
   */
  siweConfig?: Web3ModalSIWEClient
  /**
   * Theme mode configuration flag. By default themeMode option will be set to user system settings.
   * @default `system`
   * @type `dark` | `light`
   * @see https://docs.walletconnect.com/appkit/react/core/theming
   */
  themeMode?: ThemeMode
  /**
   * Theme variable configuration object.
   * @default undefined
   * @see https://docs.walletconnect.com/appkit/react/core/theming#themevariables
   */
  themeVariables?: ThemeVariables
  /**
   * Allow users to switch to an unsupported chain.
   * @see https://docs.walletconnect.com/appkit/react/core/options#allowunsupportedchain
   */
  allowUnsupportedChain?: NetworkControllerState['allowUnsupportedCaipNetwork']
  /**
   * You can set the desired caipnetworks for the app:
   * @see https://docs.walletconnect.com/appkit/react/core/options#defaultchain
   */
  caipNetworks: CaipNetwork[]
  /**
   * You can set a desired caipnetwork for the initial connection:
   * @see https://docs.walletconnect.com/appkit/react/core/options#defaultchain
   */
  defaultCaipNetwork?: NetworkControllerState['caipNetwork']
  /**
   * Add or override the modal's network images.
   * @see https://docs.walletconnect.com/appkit/react/core/options#chainimages
   */
  chainImages?: Record<number | string, string>
  /**
   * Set or override the images of any connector. The key of each property must match the id of the connector.
   * @see https://docs.walletconnect.com/appkit/react/core/options#connectorimages
   */
  connectorImages?: Record<string, string>
  /**
   * Tokens for AppKit to show the user's balance of.
   * @see https://docs.walletconnect.com/appkit/react/core/options#tokens
   */
  tokens?: Record<number, Token>
  // -- Internal options ---------------------------------- //
  siweControllerClient?: SIWEControllerClient
}