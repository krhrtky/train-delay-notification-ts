export const mockCanvas = window => {
  window.HTMLCanvasElement.prototype.getContext = function() {
    return {
      fillRect: function() {
        return
      },
      clearRect: function() {
        return
      },
      getImageData: function(x, y, w, h) {
        return {
          data: new Array(w * h * 4),
          _: x + y
        }
      },
      putImageData: function() {
        return
      },
      createImageData: function() {
        return []
      },
      setTransform: function() {
        return
      },
      drawImage: function() {
        return
      },
      save: function() {
        return
      },
      fillText: function() {
        return
      },
      restore: function() {
        return
      },
      beginPath: function() {
        return
      },
      moveTo: function() {
        return
      },
      lineTo: function() {
        return
      },
      closePath: function() {
        return
      },
      stroke: function() {
        return
      },
      translate: function() {
        return
      },
      scale: function() {
        return
      },
      rotate: function() {
        return
      },
      arc: function() {
        return
      },
      fill: function() {
        return
      },
      measureText: function() {
        return { width: 0 }
      },
      transform: function() {
        return
      },
      rect: function() {
        return
      },
      clip: function() {
        return
      }
    }
  }

  window.HTMLCanvasElement.prototype.toDataURL = function() {
    return ''
  }

  return window
}
