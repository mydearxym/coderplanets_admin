export { default as ERR } from './err'

export { default as EVENT } from './event'
export { default as TYPE } from './type'
export { default as ROUTE } from './route'
export { default as C11N } from './c11n'

export { THREAD, COMMUNITY_SPEC_THREADS } from './thread'

export { PAYMENT_USAGE, PAYMENT_METHOD } from './payment'

/* some svg icon are sensitive to fill color */
/* some community svg need fill color, like city etc.. */
export const NON_FILL_COMMUNITY = ['javascript']
