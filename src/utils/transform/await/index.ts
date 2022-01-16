export const addAwait = (spaces: string, assert: string, obj: string = "") =>
  `${" ".repeat(
    Math.max(0, (spaces + obj + assert).length - 5)
  )}(f=>(f(f.m), (() => {}) as any))(((m: string | undefined) =>` +
  ` Object.assign(m ? console.warn : () => {}, { m }))(await ${
    obj && "(" + obj.substring(0, obj.length - 1) + " as any)."
  }${assert}()))(`;
