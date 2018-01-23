/*eslint-env browser, jquery*/
/*global contentItems courseNumber*/

function respond(featureName) {
  contentItems['@graph'][0].text = $('#' + featureName + "Out").html().toString().trim();
  $('#contentItems').val(JSON.stringify(contentItems))
  document.getElementById('editor_button').submit()
}

// Button generator
function updateButton() {
  var text = $('#button input:nth-of-type(1)').val() || 'Button Text'
  var href = $('#button input:nth-of-type(2)').val()
  if ($('#button input:checkbox').is(':checked')) {
    $('#buttonOut a').addClass("Button--primary")
  } else {
    $('#buttonOut a').removeClass("Button--primary")
  }
  $('#buttonOut a').text(text)
  $('#buttonOut a').attr("href", href)
}

$('#button input:checkbox').change(updateButton)

// Change pages
function changeFocus(id) {
  if (!$("#" + id).hasClass('visible')) {
    $('.page').removeClass('visible')
    $("#" + id).addClass('visible')
  }

  if (id === 'pageTwo' && $.trim($('#templates').html()) === "") {
    loadTemplates();
  }
}

// Accordion generator
function updateAccordion() {
  var heading = $('#accordion input').val();
  var content = $('#accordion textarea').val();
  $('.accordion h3').text(heading);
  $('.accordion div').html(content);
}

// Callout generator
function updateCallout() {
  var content = $('#callout textarea').val(),
    classesToRemove = ['left', 'right', 'center', 'full', 'half', 'quarter'];

  // remove existing position & size classes
  classesToRemove.forEach((classToRemove) => {
    if ($('#calloutOut>span').hasClass(classToRemove)) {
      $('#calloutOut>span').removeClass(classToRemove);
    }
  });

  // add new position & zise classes
  $('#calloutOut>span').addClass($('#callout .position input[type="radio"]:checked').attr('value'));
  $('#calloutOut>span').addClass($('#callout .size input[type="radio"]:checked').attr('value'));

  if (content != '')
    $('#calloutOut span em').text(content);
}

// Column generator
function updateColumn() {
  var numCols = $('#columns .option input').val();

  if (numCols < 1)
    numCols = 1;
  else if (numCols > 3)
    numCols = 3;

  $.each($('#columnsOut div.col-xs-6'), (i, ele) => {
    $(ele).remove();
  });

  for (var i = 0; i < numCols; i++) {
    $('#columnsOut .grid-row').append("<div class='col-xs-6'><ul><li>Lorem ipsum dolor</li><li>Lorem ipsum dolor</li></ul></div>");
  }
}

// Dialog Generator
function updateDialog() {
  var title = $('#dialog .option input[placeholder="Dialog Title"]').val(),
    prompt = $('#dialog .option input[placeholder="Prompt Text"]').val(),
    content = $('#dialog .option textarea').val(),
    date = new Date().getTime();
  $('#dialogOut div').attr('title', title);
  $('#dialogOut a').text(prompt);
  $('#dialogOut div').html(content);
  $('#dialogOut div').attr('id', `dialog_for_link_${date}`);
  $('#dialogOut a').attr('href', `#dialog_for_link_${date}`);
  $('#dialogOut a').attr('id', date);
}

// Image generator
function updateImage() {
  var source = $('#image .option input[placeholder="Source URL"]').val(),
    alt = $('#image .option input[placeholder="Alt Text"]').val(),
    caption = $('#image .option input[placeholder="Caption Text"]').val(),
    classesToRemove = ['left', 'right', 'center', 'full', 'half', 'quarter'];

  // remove size & position classes from img
  classesToRemove.forEach((classToRemove) => {
    if ($('#imageOut>img').hasClass(classToRemove)) {
      $('#imageOut>img').removeClass(classToRemove);
    }
  });
  // add size & position classes
  $('#imageOut>img').addClass($('#image .position input[type="radio"]:checked').attr('value'));
  $('#imageOut>img').addClass($('#image .size input[type="radio"]:checked').attr('value'));

  // add/remove clearfix
  if ($('#image .option input[type="checkbox"]').is(':checked')) {
    $('#imageOut').addClass("clearfix");
  } else {
    $('#imageOut').removeClass("clearfix");
  }

  // Don't set alt to empty string
  if (source == '') {
    source = '...'
  }

  $('#imageOut img').attr('alt', alt);
  $('#imageOut img').attr('src', source);
  $('#imageOut span').html(caption);
}

// generate input tags & slides
function updateSlideCount() {
  var numSlides = $('#imgCarousel #numSlides').val(),
    curSlides = $('#imgCarousel .option input').length - 1,
    diff = numSlides - curSlides;

  // don't allow them to delete all inputs
  if (numSlides <= 0) {
    return;
  }

  if (diff > 0) {
    // add inputs & slides
    for (var i = 0; i < diff; i++) {
      $('#imgCarousel .option').append(`<input type="string" class="carouselSrcInput" onkeyup="updateCarousel()" placeholder="Img URL">`);
      $('#imgCarouselOut .carousel').append(`<div class="slide"><img src="" alt="..."></div>`);
    }
  } else if (diff < 0) {
    //remove inputs & slides
    for (var i = diff; i < 0; i++) {
      $('#imgCarousel .option input:last-child').remove();
      $('#imgCarouselOut .carousel .slide:last-child').remove();
    }
  }

}

// populate slides 
function updateCarousel() {
  $.each($('#imgCarouselOut .slide img'), (i, ele) => {
    console.log(i);
    $(ele).attr('src', $('.carouselSrcInput').eq(i).val());
  });
}

// table css
function updateTable() {
  $('#tableOut table').toggleClass('table-striped');
}

// Popover generator
function updatePopover() {
  var text = $('#popover input').val();
  var content = $('#popover textarea').val();
  $('#popoverOut a').text(text);
  $('#popoverOut a').attr('title', content);
}

//init templates
function loadTemplates() {
  $('#templateOut').html('<h4>Loading Templates...</h4>')
  if ($.trim($('#templates').html()) === '') {
    $.get('/templates').done(function (response) {
      if (response.templates.errors) {
        $('#templateOut').html('<h4>No template files found</h4>')
      } else {
        response.templates.forEach(function (template) {
          var out = '<a href="#" onclick="preview(' + "'" + template.url + "'" + ')" class="Button margin">' + template.display_name + '</a>'
          $('#templates').append(out)
        })
        $('#templateOut').html('<h4>Select a template to the Left</h4>')
      }
    }).fail(function () {
      $('#templateOut').html('<h4>Templating currently not supported on prod</h4>')
    })
  }
}

// Preview templates
function preview(url) {
  $.get("/preview?url=" + encodeURIComponent(url)).done(function (response) {
    if (response != "") {
      $('#templateOut').html(response)
      $('#submitTemplate').removeAttr('disabled')
    }
  })
}

//  Activity Banner Builder
function changeBanner(e) {
  var selected = e.target,
    classNames = selected.value,
    bannerText = selected.options[selected.selectedIndex].label,
    h2Code,
    bannerDiv;

  if(selected.id.includes('2')) {
    bannerDiv = document.getElementById('bannerOut2');
  } else {
    bannerDiv = document.getElementById('bannerOut');
  }

  if (bannerText === "Other") {
    bannerText = "Activity Name";
    classNames = "other";
  } else if (bannerText === "None") {
    // If none is selected, remove innerHTML
    bannerDiv.innerHTML = '';
    return;
  }
  h2Code = '<h2 class="activity ' + classNames.split(' ')[1] + '">' + bannerText + '</h2>';
  // append h2 to html
  bannerDiv.innerHTML = h2Code;
}

// event listeners for activity banners
document.getElementById('activitySelected').onchange = changeBanner;
document.getElementById('activitySelected2').onchange = changeBanner;

//  Accordion init
$(document).ready(function () {
  $('div.accordion').accordion({
    heightStyle: 'content',
    collapsible: true,
    active: false
  });

  if (document.querySelector('.byui-custom') !== null) {
    document.querySelector('.byui-custom').insertAdjacentHTML('beforeend', '<link type="text/css" rel="stylesheet" href="https://byui.instructure.com/courses/' + courseNumber + '/file_contents/course%20files/Web%20Files/course-min.css" >')
  }
});

//Activity Template Selector
$('#selectTemplate').on("change", function () {
  $('#orgTemplateOut').html($('#template_' + this.value).html())
})