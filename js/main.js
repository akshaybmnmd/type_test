var dock =
  "Write short paragraphs and cover one topic per paragraph. Long paragraphs discourage users from even trying to understand your material. Short paragraphs are easier to read and understand.";
var start_typing = false;
var complete = false;
var start_time = false;
var end_time = false;
var typed_words = "";
const notUsedKeys = [16, 17, 18];
var error_count = 0;
var backspace_count = 0;
var last_word = false;

$(document).ready(() => {
  $("#paragraph").html(dock.replaceAll("\n", "<br><br>"));

  $("#typed_words").click(() => {
    if (!start_typing) $("#typed_words").text("start typing to start.");
    start_typing = true;
  });
});

$(document).keydown((c) => {
  if (start_typing) {
    if (!start_time) start_time = c.timeStamp;
    let keyCode = c.keyCode;
    let key = c.key;

    if (notUsedKeys.includes(keyCode)) return;

    switch (keyCode) {
      case 8:
        typed_words = typed_words.slice(0, -1);
        backspace_count++;
        break;
      case 13:
        if (last_word) {
          complete = true;
          end_time = c.timeStamp;
          alert("done");
        } else typed_words += "\n";
        break;
      default:
        typed_words += key;
        break;
    }

    let typed_html = check_word(key);

    $("#typed_words").html(typed_html);
  }
});

function check_word(key) {
  let typed_html = "";

  //   let og_paragraphs = dock.split("\n");

  //   og_paragraphs.forEach((og_paragraph, og_paragraph_key) => {
  //     console.log(og_paragraph, og_paragraph_key);
  //     let og_sentances = og_paragraph.split(". ");
  //     og_sentances.forEach((og_sentance, og_sentance_key) => {
  //       console.log(og_sentance, og_sentance_key);
  //       let og_words = (og_sentance + ".").split(" ");
  //       og_words.forEach((og_word, og_word_key) => {
  //         console.log(og_word, og_word_key);
  //       });
  //     });
  //   });

  let og_words = dock.split(" ");
  let words = typed_words.split(" ");

  if (og_words.length == words.length) last_word = true;
  let pos = words.length - 1;
  let cos = words[pos].length - 1;

  if (og_words[pos][cos] != key) error_count++;

  words.forEach((word, word_key) => {
    let og_word = og_words[word_key];
    typed_html += " ";

    [...word].forEach((char, char_key) => {
      if (og_word[char_key] == char) typed_html += char;
      else typed_html += "<span class='error'>" + char + "</span>";
    });
  });

  if (complete) show_results(words.length);

  return typed_html.replaceAll("\n", "<br>");
}

function show_results(words) {
  let seconds_taken = (end_time - start_time) / 1000;
  let minutes_taken = (end_time - start_time) / 60000;
  $("#errors").text(error_count);
  $("#backspaces").text(backspace_count);
  $("#time").text(seconds_taken.toFixed(2) + " seconds");
  $("#wps").text((words / seconds_taken).toFixed(1));
  $("#wpm").text((words / minutes_taken).toFixed(1));
}
