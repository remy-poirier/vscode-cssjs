document.addEventListener("DOMContentLoaded", function () {
  const checkElement = setInterval(() => {
    const commandDialog = document.querySelector(".quick-input-widget")

    if (commandDialog) {
      // Vérifie si commandDialog est un HTMLElement
      if (commandDialog instanceof HTMLElement) {
        // Create an DOM observer to 'listen' for changes in element's attribute.
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "style"
            ) {
              if (commandDialog.style.display === "none") {
                handleEscape()
              } else {
                // If the .quick-input-widget element (command palette) is in the DOM
                // but no inline style display: none, show the backdrop blur.
                runMyScript()
              }
            }
          })
        })

        observer.observe(commandDialog, { attributes: true })

        // Clear the interval once the observer is set
        clearInterval(checkElement)
      } else {
        console.error("Command dialog is not an HTMLElement.")
      }
    } else {
      console.log("Command dialog not found yet. Retrying...")
    }

    const errorInFile = document.querySelectorAll(".squiggly-error")
    const errorElement = document.getElementById("my-error-overlay")
    if(errorElement && errorInFile.length === 0) {
      errorElement.remove()
    }

    if(errorInFile.length > 0 && !errorElement) {
      const errorOverlay = document.createElement("div")
      const parentElement = document.querySelector(".editor-container > .editor-instance > .monaco-editor > .overflow-guard")
      errorOverlay.setAttribute("id", "my-error-overlay")
      errorOverlay.innerHTML = errorInFile.length === 1 ? "Woops, you have an error in your file" : `Sheeeesh ! There are ${errorInFile.length} errors in your file, good luck !`
      parentElement.appendChild(errorOverlay)
    }
  }, 500) // Check every 500ms

  // Execute when command palette was launched.
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "p") {
      event.preventDefault()
      runMyScript()
    } else if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault()
      handleEscape()
    }
  })

  // Ensure the escape key event listener is at the document level
  document.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        handleEscape()
      }
    },
    true
  )

  function runMyScript() {
    const targetDiv = document.querySelector(".monaco-workbench")

    // Remove existing element if it already exists
    const existingElement = document.getElementById("command-blur")
    if (existingElement) {
      existingElement.remove()
    }

    // Create and configure the new element
    const newElement = document.createElement("div")
    newElement.setAttribute("id", "command-blur")

    newElement.addEventListener("click", function () {
      newElement.remove()
    })

    // Append the new element as a child of the targetDiv
    targetDiv?.appendChild(newElement)
  }

  // Remove the backdrop blur from the DOM when esc key is pressed.
  function handleEscape() {
    const element = document.getElementById("command-blur")
    if (element) {
      element.click()
    }
  }
})
