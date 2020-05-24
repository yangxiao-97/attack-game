// (function () {
//   // 获取canvas
//   const context = document.getElementById('content').getContext('2d');
//   // 读取图片
//   const heroImg = new Image();
//   heroImg.onload = function () {
//     //确定图片中英雄的位置
//     var imgPosition = {
//       x: 0,
//       y: 0,
//       width: 32,
//       height: 32
//     }
//     //确定英雄在画布上的位置
//     var heroRect = {
//       x: 0,
//       y: 0,
//       width: 40,
//       height: 40
//     }
//     context.drawImage(
//       heroImg,
//       imgPosition.x,
//       imgPosition.y,
//       imgPosition.width,
//       imgPosition.height,
//       heroRect.x,
//       heroRect.y,
//       heroRect.width,
//       heroRect.height
//     )
//   }
//   heroImg.src = 'hero.png'
// })();

//利用闭包重构，封装私有变量，解耦
(function () {
  //准备工作
  function prepare() {
    // 图片加载器,ES6
    const imgTask = (img, src) => {
      return new Promise(function (resolve, reject) {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      })
    }
    // 获取canvas
    const context = document.getElementById('content').getContext('2d');
    // 读取英雄图片
    const heroImg = new Image();
    // 读取怪物精灵图
    const spriteImg = new Image();
    // 统一获取图片工作
    const allImg = Promise.all([
      imgTask(heroImg, 'hero.png'),
      imgTask(spriteImg, 'all.jpg'),
    ])
    // 社区规则：优先使用const
    //let loaded = false;
    return {
      /** 
       * @params {Function} [cb]当准备工作完成后要调用的回调函数
       */
      getResource(cb) {
        allImg.then(function () {
          cb && cb(context, heroImg, spriteImg);
        })
        //利用闭包作缓存
        //当图片不是第一次加载的的时候，直接从cb中获取资源，不再重新获取资源
        // if (loaded) {
        //   cb && cb(context, heroImg);
        //   return;
        // }
        // heroImg.onload = function () {
        //   cb && cb(context, heroImg, spriteImg);
        //loaded = true;
        // };
      }
    }
  }

  //绘图工作
  function drawing(context, heroImg, spriteImg) {
    //封装一个draw方法
    var draw = function () {
      this.context.drawImage(
        this.img,
        this.imgPosition.x,
        this.imgPosition.y,
        this.imgPosition.width,
        this.imgPosition.height,
        this.imgRect.x,
        this.imgRect.y,
        this.imgRect.width,
        this.imgRect.height
      )
    }
    //定义一个英雄对象，包含英雄在图片的位置和在画布上的位置，以及封装的draw方法
    var hero = {
      img: heroImg,
      context: context,
      imgPosition: {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      },
      imgRect: {
        x: 0,
        y: 0,
        width: 40,
        height: 40
      },
      draw: draw
    }
    //定义一个怪物对象，包含怪物在精灵图中的位置和在画布上的位置，以及封装的draw方法
    var monster = {
      img: spriteImg,
      context: context,
      imgPosition: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },
      imgRect: {
        x: 100,
        y: 100,
        width: 40,
        height: 40
      },
      draw: draw
    }
    //分别调用draw方法
    hero.draw()
    monster.draw()
  }

  var resource = prepare();
  resource.getResource(function (context, heroImg, spriteImg) {
    drawing(context, heroImg, spriteImg)
  })
  // document.getElementById('button').addEventListener('click', function () {
  //   resource.getResource(function (context, heroImg, ) {
  //     draw(context, heroImg, {
  //       initX: Math.random() * 200,
  //       initY: Math.random() * 200
  //     })
  //   })
  // })
})()