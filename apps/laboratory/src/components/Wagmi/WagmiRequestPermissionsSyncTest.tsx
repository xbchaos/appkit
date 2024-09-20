import { Button, Stack, Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useCallback, useState } from 'react'
import { useChakraToast } from '../Toast'
import { type Address, type Chain } from 'viem'
import { EIP_7715_RPC_METHODS } from '../../utils/EIP5792Utils'
import { usePasskey } from '../../context/PasskeyContext'
import {
  useWagmiAvailableCapabilities,
  type Provider
} from '../../hooks/useWagmiActiveCapabilities'
import { useERC7715Permissions } from '../../hooks/useERC7715Permissions'
import { bigIntReplacer } from '../../utils/CommonUtils'
import { getPurchaseDonutPermissions } from '../../utils/ERC7715Utils'
import { serializePublicKey, type P256Credential } from 'webauthn-p256'
import { encodePublicKeyToDID, KeyTypes } from '../../utils/EncodingUtils'
import { useAppKitAccount } from '@reown/appkit/react'
import { useSmartSession } from '@reown/appkit-experimental-smart-session'

export function WagmiRequestPermissionsSyncTest() {
  const { provider, supported } = useWagmiAvailableCapabilities({
    method: EIP_7715_RPC_METHODS.WALLET_GRANT_PERMISSIONS
  })
  const { address, isConnected } = useAppKitAccount()
  const { chain } = useAccount()

  if (!isConnected || !provider || !address || !chain) {
    return (
      <Text fontSize="md" color="yellow">
        Wallet not connected
      </Text>
    )
  }
  if (!supported) {
    return (
      <Text fontSize="md" color="yellow">
        Wallet does not support wallet_grantPermissions rpc method
      </Text>
    )
  }

  return <ConnectedTestContent chain={chain} provider={provider} address={address as Address} />
}

function ConnectedTestContent({
  chain,
  provider,
  address
}: {
  chain: Chain
  provider: Provider
  address: Address | undefined
}) {
  const { grantPermissions } = useSmartSession()
  const [isRequestPermissionLoading, setRequestPermissionLoading] = useState<boolean>(false)
  const { passkey } = usePasskey()
  const { grantedPermissions, clearGrantedPermissions } = useERC7715Permissions()
  const toast = useChakraToast()

  const onRequestPermissions = useCallback(async () => {
    setRequestPermissionLoading(true)
    try {
      if (!address) {
        throw new Error('No account address available, Please connect your wallet.')
      }
      if (!passkey) {
        throw new Error('Passkey not available')
      }
      let p256Credential = passkey as P256Credential
      p256Credential = {
        ...p256Credential,
        publicKey: {
          prefix: p256Credential.publicKey.prefix,
          x: BigInt(p256Credential.publicKey.x),
          y: BigInt(p256Credential.publicKey.y)
        }
      }
      const passkeyPublicKey = serializePublicKey(p256Credential.publicKey, { to: 'hex' })
      const purchaseDonutPermissions = getPurchaseDonutPermissions()
      const dAppKeyDID = encodePublicKeyToDID(passkeyPublicKey, KeyTypes.secp256r1)
      purchaseDonutPermissions.signer = {
        type: 'key',
        data: {
          ids: [dAppKeyDID]
        }
      }
      const response = await grantPermissions(purchaseDonutPermissions)

      toast({
        type: 'success',
        title: 'Permissions Granted',
        description: JSON.stringify(response, bigIntReplacer)
      })
    } catch (error) {
      toast({
        type: 'error',
        title: 'Request Permissions Errors',
        description: error instanceof Error ? error.message : 'Unknown Error'
      })
    } finally {
      setRequestPermissionLoading(false)
    }
  }, [passkey, provider, address, chain, grantPermissions, toast])

  return (
    <Stack direction={['column', 'column', 'row']}>
      <Button
        data-testid="request-permissions-button"
        onClick={onRequestPermissions}
        isDisabled={Boolean(isRequestPermissionLoading || Boolean(grantedPermissions))}
        isLoading={isRequestPermissionLoading}
      >
        Request Permissions
      </Button>
      <Button
        data-test-id="clear-permissions-button"
        onClick={clearGrantedPermissions}
        isDisabled={!grantedPermissions}
      >
        Clear Permissions
      </Button>
    </Stack>
  )
}
