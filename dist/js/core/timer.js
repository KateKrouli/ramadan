export function startTimer(target, onTick, onEnd) {
  function tick() {
    const now = new Date()
    const diff = target - now

    if (diff <= 0) {
      onEnd()
      return
    }

    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    onTick(
      `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    )
  }

  tick()
  return setInterval(tick, 1000)
}
