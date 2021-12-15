import "./style.css"
import scene from "/.ghostlight/scenes/scene.json"
import {
  Actor,
  Canvas,
  CollisionType,
  Color,
  Engine,
  ImageSource,
  Input,
  Loader,
  Physics,
  Rectangle,
  Sprite,
  Vector,
} from "excalibur"

// TODO: load all assets from gl dir
// TODO: denormalize actors on load
// TODO: dynamic actor instantiation with custom behavior (kiss, maybe factory functions or something?)

// settings
////////////////////////////////////////////////////////////////////////////////
const zoom = 4
const force = {
  gravity: 400,
  move: 80,
  jump: 160,
}

// asset loading
////////////////////////////////////////////////////////////////////////////////
const loader = new Loader()
const assets = {
  player: new ImageSource("/Player.png"),
  metal: new ImageSource("/Metal.png"),
}
loader.addResources(Object.values(assets))

// types
////////////////////////////////////////////////////////////////////////////////
function makeActor(data: IActor) {
  const {x, y, width, height} = data
  const actor = new Actor({x, y, width, height, anchor: Vector.Zero})

  // color
  const color = new Rectangle({color: Color.Gray, width, height})

  // image, scaled
  const scaled = new Sprite({
    image: assets[data.type_id],
    destSize: {width, height},
  })

  // image, repeated
  const repeated = new Canvas({
    cache: true,
    draw: (ctx) => {
      ctx.fillStyle = ctx.createPattern(assets[data.type_id].image, "repeat")!
      ctx.fillRect(0, 0, width, height)
    },
  })

  // image, sliced
  const sliced = new Canvas({
    cache: true,
    draw: (ctx) => {
      drawSliced(ctx, assets[data.type_id].image, 0, 0, width, height)
    },
  })

  actor.graphics.use(sliced, {anchor: Vector.Zero})
  return actor
}

// dom
////////////////////////////////////////////////////////////////////////////////
const canvas = document.createElement("canvas")
canvas.style["zoom"] = 1 / window.devicePixelRatio

// game
////////////////////////////////////////////////////////////////////////////////
const game = new Engine({
  canvasElement: canvas,
  suppressHiDPIScaling: true,
  antialiasing: false,
  suppressPlayButton: true,
  resolution: {
    width: scene.config.width,
    height: scene.config.height,
  },
  viewport: {
    width: scene.config.width * zoom,
    height: scene.config.height * zoom,
  },
  backgroundColor: Color.fromHex(scene.config.background),
})
Physics.acc.setTo(0, force.gravity)
// game.showDebug(true)
game.start(loader).then(() => {
  // scene.actors.forEach((a) => {
  //   game.add(makeActor(a))
  // })

  const player = makeActor(scene.actors[0])
  player.body.collisionType = CollisionType.Active
  player.on("preupdate", () => {
    player.body.vel.x = force.move * (+game.input.keyboard.isHeld(Input.Keys.Right) - +game.input.keyboard.isHeld(Input.Keys.Left))
    if (game.input.keyboard.wasPressed(Input.Keys.Space)) player.body.vel.y = -force.jump
  })
  game.add(player)

  const floor = makeActor(scene.actors[1])
  floor.body.collisionType = CollisionType.Fixed
  game.add(floor)

  document.body.appendChild(canvas)
})

// ..................................................
function drawSliced(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x = 0, y = 0, w = 0, h = 0) {
  const s = img.width / 2 // size of one slice

  // corners
  ctx.drawImage(img,
    0, 0, s, s,
    x, y, s, s,
  )
  ctx.drawImage(img,
    s, 0, s, s,
    x + w - s, y, s, s,
  )
  ctx.drawImage(img,
    s, s, s, s,
    x + w - s, y + h - s, s, s,
  )
  ctx.drawImage(img,
    0, s, s, s,
    x, y + h - s, s, s,
  )

  // sides and center (they form a 1px cross in the middle of the img)
  ctx.drawImage(img,
    s, 0, 1, s,
    x + s, y, w - 2 * s, s,
  )
  ctx.drawImage(img,
    s, s, 1, s,
    x + s, y + h - s, w - 2 * s, s,
  )
  ctx.drawImage(img,
    0, s, s, 1,
    x, y + s, s, h - 2 * s,
  )
  ctx.drawImage(img,
    s, s, s, 1,
    x + w - s, y + s, s, h - 2 * s,
  )
  ctx.drawImage(img,
    s, s, 1, 1,
    x + s, y + s, w - 2 * s, h - 2 * s,
  )
}
