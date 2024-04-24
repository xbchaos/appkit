import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import '../../components/wui-text/index.js'
import '../../components/wui-image/index.js'
import '../../layout/wui-flex/index.js'
import { elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import { customElement } from '../../utils/WebComponentsUtil.js'
import styles from './styles.js'
import { UiHelperUtil } from '../../utils/UiHelperUtil.js'
import { W3mFrameRpcConstants } from '@web3modal/wallet'

@customElement('wui-list-account')
export class WuiListAccount extends LitElement {
  public static override styles = [resetStyles, elementStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public accountAddress = ''

  @property() public accountType = ''

  // Fetch balance from the blockchain
  @property({ type: Number }) public balance = 23.18

  // -- Render -------------------------------------------- //
  public override render() {
    console.log('WuiListAccount', this.accountAddress)

    return html`
      <wui-flex
        flexDirection="row"
        justifyContent="space-between"
        .padding=${['s', 'xs', 's', '1xs'] as const}
      >
        <wui-flex gap="s" alignItems="center">
          <wui-avatar address=${this.accountAddress}></wui-avatar>
          <wui-icon-box
            size="sm"
            iconcolor="fg-200"
            backgroundcolor="glass-002"
            background="gray"
            icon=${this.accountType === W3mFrameRpcConstants.ACCOUNT_TYPES.EOA
              ? 'mail'
              : 'lightbulb'}
            ?border=${true}
          ></wui-icon-box>
          <wui-flex flexDirection="column">
            <wui-text class="address" variant="paragraph-500" color="fg-100"
              >${UiHelperUtil.getTruncateString({
                string: this.accountAddress,
                charsStart: 4,
                charsEnd: 6,
                truncate: 'middle'
              })}</wui-text
            >
            <wui-text class="address-description" variant="small-400"
              >${this.accountType === 'eoa' ? 'Email' : 'Smart'} Account</wui-text
            ></wui-flex
          >
        </wui-flex>
        <wui-flex gap="s" alignItems="center">
          <wui-text variant="small-400">$${this.balance.toFixed(2)}</wui-text>
          <slot name="action"></slot>
        </wui-flex>
      </wui-flex>
    `
  }

  /*
   * Private templateIcon() {
   *   // Const color: 'accent-100' | 'error-100' | 'success-100' | 'inverse-100' = 'accent-100'
   */

  //   Const icon = 'mail'

  /*
   *   Return html`
   *     <wui-icon-box
   *       size="xxs"
   *       background=""
   *       color="accent-100"
   *       icon=${icon}
   *       ?border=${true}
   *       borderColor="wui-color-bg-125"
   *     ></wui-icon-box>
   *   `
   * }
   */
}

declare global {
  interface HTMLElementTagNameMap {
    'wui-list-account': WuiListAccount
  }
}