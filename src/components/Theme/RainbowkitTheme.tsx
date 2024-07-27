import { RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'

const myCustomTheme: Theme = {
  colors: {
    accentColor: '#F12379', // Button bg: Pink
    accentColorForeground: 'white',
    actionButtonBorder: 'hsl(228, 9%, 11%)',
    actionButtonBorderMobile: 'hsl(228, 9%, 11%)',
    actionButtonSecondaryBackground: 'hsl(0, 0%, 100%)',
    closeButton: 'hsl(226, 11%, 64%)',
    closeButtonBackground: 'hsl(228, 5%, 18%)',
    connectButtonBackground: '#1a1b1f', // Navbar Buttons: Dark Gray
    connectButtonBackgroundError: 'hsl(360,100%,64%)',
    connectButtonInnerBackground: 'hsl(225, 4%, 21%)',
    connectButtonText: 'hsl(0, 0%, 100%)',
    connectButtonTextError: 'hsl(0,0%,100%)',
    error: 'hsl(0,0%,100%)',
    generalBorder: 'hsl(228, 5%, 18%)',
    generalBorderDim: 'rgba(0, 0, 0, 0.03)',
    menuItemBackground: 'hsl(229, 9%, 20%)',
    modalBackdrop: 'rgba(0, 0, 0, 0.5)',
    modalBackground: '#020810', // Modal bg: Black Blue
    modalBorder: '#A72F60', // Modal Border: Pink
    modalText: 'hsl(0, 0%, 100%)',
    modalTextDim: 'rgba(60, 66, 66, 0.3)',
    modalTextSecondary: 'hsl(0, 0%, 60%)',
    profileAction: '#F12379', // Profile Button" Pink
    profileActionHover: '#FE3187', // Profile Button Hover: LightPink
    profileForeground: '#020810', // Profile Button bg: Black Blue
    selectedOptionBorder: '#F12379', // Button Border: Pink
    downloadBottomCardBackground:
      '"linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF"',
    downloadTopCardBackground:
      '"linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF"',
    connectionIndicator: 'hsl(107, 100%, 44%)',
    standby: 'hsl(47, 100%, 63%)',
  },
  radii: {
    actionButton: '9999px',
    connectButton: '12px',
    menuButton: '12px',
    modal: '24px',
    modalMobile: '24px',
  },
  shadows: {
    connectButton: '0px 8px 32px rgba(0, 0, 0, 0.32)',
    dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
    profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
    selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
    selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.12)',
    walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
  },
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  fonts: {
    body: '...', // default
  },
}

export default myCustomTheme
