declare global {
  namespace Express { // eslint-disable-line
    interface Request {
      user?: string
    }
  }
}

export {}
