"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle form submission for adding a new story */
async function submitNewStory(evt) {
  evt.preventDefault();  // Prevent the default form submission behavior

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  const newStory = await storyList.addStory(currentUser, { title, author, url });

  // Add the new story to the page
  const $story = generateStoryMarkup(newStory);
  $("#all-stories-list").prepend($story);

  // Hide the form and reset it
  $(".add-story-form").hide();
  $("#add-story-form").trigger("reset");
}

// Attach the event handler to the form submission
$("#add-story-form").on("submit", submitNewStory);