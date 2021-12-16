import glScene from "/.ghostlight/scenes/scene.json?raw"
import glTypes from "/.ghostlight/types/types.json?raw"
import {Color, Engine, Physics} from "excalibur"
import {parse} from "/src/utils/parse"
import {makeImage} from "/src/utils/makeImage"
import {makeActor} from "/src/utils/makeActor"

const glAssets = import.meta.globEager("/.ghostlight/assets/*")
const actorModules = import.meta.globEager("/src/actorTypes/*.ts")

main()
async function main() {
  // load ghostlight data
  //////////////////////////////////////////////////////////////////////////////
  const scene = parse(glScene, glTypes)
  const assets = new Map<string, HTMLImageElement>()
  for (const module of Object.values(glAssets)) {
    const path = module.default
    const name = path.split("/").reverse()[0].replace(/\..+\./, ".") // remove hash in production
    assets.set(name, await makeImage(path))
  }

  // start game
  //////////////////////////////////////////////////////////////////////////////
  const game = new Engine({
    suppressHiDPIScaling: true,
    antialiasing: false,
    width: scene.config.width,
    height: scene.config.height,
    backgroundColor: Color.fromHex(scene.config.background),
  })
  Physics.acc.setTo(0, 500)
  scene.actors.forEach((actor) => {
    const module = Object.values(actorModules).find((x) => x[actor.type])
    const type = module ? module[actor.type] : null
    game.add(makeActor(actor, type, assets))
  })
  await game.start()
  // game.showDebug(true)
}
