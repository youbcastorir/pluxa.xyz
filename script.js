var iframe_names = [
  ['demo1'],
  ['demo2'],
  ['demo3'],
  ['demo4'],
  ['demo5'],
  ['demo6'],
  ['demo7']
];

var iframe_names_geo = [
  ['demo1'],
  ['demo2'],
  ['demo3'],
  ['demo4'],
  ['demo5'],
  ['demo6'],
  ['demo7']
];

var iframes = [];
var curr_type = 0;
var selected_option = 0;
var current_iframe_idx = 0;

const optionsSets = [
  ['demo1'],
  ['demo2'],
  ['demo3'],
  ['demo4'],
  ['demo5'],
  ['demo6'],
  ['demo7']
];

$(function() {
  thumbnails = [
    document.getElementById('thumb-0'),
    document.getElementById('thumb-1'),
    document.getElementById('thumb-2'),
    document.getElementById('thumb-3'),
    document.getElementById('thumb-4'),
    document.getElementById('thumb-5'),
    document.getElementById('thumb-6'),
  ];
  for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener('click', showIframe.bind(this, i, false));
    thumbnails[i].addEventListener('click', updateOptions.bind(this));
    thumbnails[i].addEventListener('click', selectOption.bind(this, optionsSets[i][0], 0));
  }
  
  if (iframes.length == 0) {
    load_iframes();
  };
});

function load_iframes() {
  var geo = [];
  var sem = [];
  for (var i = 0; i < iframe_names.length; i++) {
    var geo_temp = [];
    var sem_temp = [];
    for (var j = 0; j < iframe_names[i].length; j++) {
      sem_temp.push(document.getElementById(iframe_names[i][j])); 
      geo_temp.push(document.getElementById(iframe_names_geo[i][j])); 
    }
    sem.push(sem_temp); 
    geo.push(geo_temp); 
  }
  iframes.push(sem);
  iframes.push(geo);
}

function showIframe(index, fade=false) {
  thumbnails[index].classList.add("active-btn");
  if (current_iframe_idx != index) {
    thumbnails[current_iframe_idx].classList.remove("active-btn");
  }
  current_iframe_idx = index;
  
  // Hide all model-viewer elements
  for (let type = 0; type < iframes.length; type++) {
    for (let i = 0; i < iframes[type].length; i++) {
      for (let j = 0; j < iframes[type][i].length; j++) {
        if (iframes[type][i][j]) {
          iframes[type][i][j].style.display = 'none';
        }
      }
    }
  }

  // Show the selected model-viewer element
  const selectedIframe = iframes[curr_type][index][selected_option];
  if (selectedIframe) {
    if (fade) {
      // With transition
      fadeIn(selectedIframe);
    } else {
      // Without transition
      selectedIframe.style.display = 'block';
    }
  }
}

function fadeIn(element) {
  element.style.display = 'block';
  element.style.opacity = 0;
  var op = 0;
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    op += 0.1;
  }, 50);
}

function fullscreen() {
  current_iframe = iframes[curr_type][current_iframe_idx][selected_option];
  if (current_iframe.requestFullscreen) {
    current_iframe.requestFullscreen();
  } else if (current_iframe.webkitRequestFullscreen) {
    current_iframe.webkitRequestFullscreen();
  } else if (current_iframe.msRequestFullscreen) {
    current_iframe.msRequestFullscreen();
  }
}

function updateOptions() {
  const optionsMenu = document.getElementById('options-menu');
  optionsMenu.innerHTML = ''; // Clear previous options

  // Add new options based on the activeSet
  optionsSets[current_iframe_idx].forEach((option, index) => {
    const li = document.createElement('li');
    li.textContent = option;

    // Use a closure to capture the current index value
    li.onclick = (function (opt, idx) {
      return function () {
        selectOption(opt, idx); // Pass the option and index here
      };
    })(option, index);

    optionsMenu.appendChild(li);
  });
}

function selectOption(option, idx) {
  const selectedOptionText = document.getElementById('selected-option');
  selectedOptionText.textContent = option;
  selected_option = idx;
  showIframe(current_iframe_idx);
}

window.onload = function() {
  const root = document.documentElement;
  const checkbox = document.getElementById('opacity-toggle');
  if (iframes.length == 0) {
    load_iframes();
  };
  checkbox.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      // Semantic
      curr_type = 0;
      showIframe(current_iframe_idx);
    } else {
      // Geometric
      curr_type = 1;
      showIframe(current_iframe_idx);
    }
  })

  showIframe(0);
  updateOptions();
  selectOption(optionsSets[current_iframe_idx][0], 0);
}

function slide_left() {
  var idx = current_iframe_idx;
  if (idx - 1 < 0) {
    idx = iframes[0].length - 1;
  } else {
    idx = idx - 1;
  }
  showIframe(idx);
  updateOptions();
  selectOption(optionsSets[current_iframe_idx][0], 0);
}

function slide_right() {
  var idx = current_iframe_idx;
  if (idx + 1 > iframes[0].length - 1) {
    idx = 0;
  } else {
    idx = idx + 1;
  }
  showIframe(idx);
  updateOptions();
  selectOption(optionsSets[current_iframe_idx][0], 0);
}

// Close the dropdown menu when clicking outside of it
window.addEventListener('click', function(event) {
  const optionsMenu = document.getElementById('options-menu');
  const dropdownBtn = document.querySelector('.dropdown-btn');

  if (!event.target.matches('.dropdown-btn') && !event.target.matches('.arrow')) {
    optionsMenu.classList.remove('show');
  }
});
