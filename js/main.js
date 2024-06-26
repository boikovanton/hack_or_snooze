"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const $story = $(`
    <li id="${story.storyId}" class="story-item">
      <h3 class="story-title">${story.title}</h3>
      <p class="story-author">by ${story.author}</p>
      <p class="story-url"><a href="${story.url}" target="_blank">${hostName}</a></p>
      <button class="favorite-button" data-story-id="${story.storyId}">Add to Favorites</button>
      <button class="unfavorite-button hidden" data-story-id="${story.storyId}">Remove from Favorites</button>
    </li>
  `);

  // Show favorite/unfavorite button based on user's favorites
  if (currentUser) {
    if (currentUser.isFavorite(story)) {
      $story.find(".unfavorite-button").removeClass("hidden");
      $story.find(".favorite-button").addClass("hidden");
    } else {
      $story.find(".favorite-button").removeClass("hidden");
      $story.find(".unfavorite-button").addClass("hidden");
    }
  }

  return $story;
}