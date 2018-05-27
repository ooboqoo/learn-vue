export let warn = () => { }

if (process.env.NODE_ENV !== 'production') {
  warn = (msg, vm) => { console.error(`[Vue warn]: ${msg}`) }
}
