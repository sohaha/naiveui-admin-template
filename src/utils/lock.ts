import zlog, { field } from '@sohaha/zlog'

export class ReadWriteLock {
  private readers: number
  private writer: boolean
  private waitingWriters: ((v?: unknown) => void)[]
  private waitingReaders: ((v?: unknown) => void)[]

  constructor() {
    this.readers = 0
    this.writer = false
    this.waitingWriters = []
    this.waitingReaders = []
  }

  async lockRead(): Promise<void> {
    if (this.writer || this.waitingWriters.length > 0)
      await new Promise(resolve => this.waitingReaders.push(resolve))

    this.readers++
  }

  async unlockRead(): Promise<void> {
    this.readers--
    if (this.readers === 0 && this.waitingWriters.length > 0) {
      this.writer = true
      const nextWriter = this.waitingWriters.shift()
      if (nextWriter)
        nextWriter()
    }
  }

  async lockWrite(): Promise<void> {
    zlog.debug('lockWrite', field('writer', this.writer), field('readers', this.readers))

    if (this.writer || this.readers > 0)
      await new Promise(resolve => this.waitingWriters.push(resolve))

    this.writer = true
  }

  async unlockWrite(): Promise<void> {
    zlog.debug('unlockWrite', field('waitingWriters', this.waitingWriters.length))

    this.writer = false

    if (this.waitingWriters.length > 0) {
      const nextWriter = this.waitingWriters.shift()
      if (nextWriter)
        nextWriter()
    }
    else {
      while (this.waitingReaders.length > 0) {
        const nextReader = this.waitingReaders.shift()
        if (nextReader)
          nextReader()
      }
    }
  }
}
