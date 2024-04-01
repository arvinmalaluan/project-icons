
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
  
    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
      if (all) {
        select(el, all).forEach(e => e.addEventListener(type, listener))
      } else {
        select(el, all).addEventListener(type, listener)
      }
    }
  
    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }
  
    /**
     * Sidebar toggle
     */
    if (select('.toggle-sidebar-btn')) {
 
      on('click', '.toggle-sidebar-btn', function(e) {
        console.log("wow");
        
        select('body').classList.toggle('toggle-sidebar')
      })
    }
  
    /**
     * Search bar toggle
     */
    if (select('.search-bar-toggle')) {
      on('click', '.search-bar-toggle', function(e) {
        select('.search-bar').classList.toggle('search-bar-show')
      })
    }
  
    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)
  
    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }
  
    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }
  
    /**
     * Initiate tooltips
     */
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  
    
    /**
     * Initiate Bootstrap validation check
     */
    var needsValidation = document.querySelectorAll('.needs-validation')
  
    Array.prototype.slice.call(needsValidation)
      .forEach(function(form) {
        form.addEventListener('submit', function(event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  
    /**
     * Initiate Datatables
     */
    const datatables = select('.datatable', true)
    datatables.forEach(datatable => {
      new simpleDatatables.DataTable(datatable, {
        perPageSelect: [5, 10, 15, ["All", -1]],
        columns: [{
            select: 2,
            sortSequence: ["desc", "asc"]
          },
          {
            select: 3,
            sortSequence: ["desc"]
          },
          {
            select: 4,
            cellClass: "green",
            headerClass: "red"
          }
        ]
      });
    })
  
    /**
     * Autoresize echart charts
     */
    const mainContainer = select('#main');
    if (mainContainer) {
      setTimeout(() => {
        new ResizeObserver(function() {
          select('.echart', true).forEach(getEchart => {
            echarts.getInstanceByDom(getEchart).resize();
          })
        }).observe(mainContainer);
      }, 200);
    }
    




    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

    function previewImage(event) {
    var imageContainer = document.getElementById('imageContainer');
    var file = event.target.files[0];
    var reader = new FileReader();
    
    reader.onloadend = function() {
    var imageSrc = reader.result;
    
    // Create a new image element with Bootstrap classes
    var image = document.createElement('img');
    image.classList.add('img-fluid', 'w-100');
    image.src = imageSrc;
    
    // Clear previous content and append the new image
    imageContainer.innerHTML = '';
    imageContainer.appendChild(image);
    
    // Center the image vertically and horizontally
    imageContainer.classList.add('d-flex', 'align-items-center', 'justify-content-center');
    };
    
    if (file) {
    reader.readAsDataURL(file);
    } else {
    // If no file is selected, restore default content
    restoreDefaultContent(imageContainer);
    }
    }
    
    function restoreDefaultContent(container) {
    // Restore default content
    container.innerHTML = `
    <div class="rounded-circle d-flex align-items-center justify-content-center" style="border: 1px solid gainsboro; width: 200px; height: 200px;">
        <img id="imagePreview" src="../img/img-preview.png" alt="Preview" class="img-fluid w-50">
    </div>
    <h5 class="mt-3">Click here to Attach Image</h5>
    <br>
    <p>Maximum</p>
    `;
    }
    
