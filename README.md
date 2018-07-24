# Project 2 - Chatter Box

General: Flask Application that Uses Socket IO and JavaScript for aysnc Messaging

application.py
-- single page app renders main template index.html
-- channel_* variables control channel list and messages per channel
-- server side socket listeners manage
    1) adding new channels - check exists and sends back to client
    2) User Messages Per Channel - stores and sends back to client

index.html
-- bootrap containers, rows, and cols
-- Jinja template renders channel list group
-- Jinja nested template renders message area for each channel - default hidden
-- Dynamic Ids and Classes based of channel name
-- Help Modal for End User
-- Key Features - user channel dynamic navigation

index.js
-- socket io listeners and emiters for messages and channels
-- timestamp function for formatting
-- switch channel function for user navigation and selection
-- scroll control for many messages in message area
-- local storage to remember username and channel
-- DOM Content Loaded events
  1) display name required to submit messages
  2) dismissable alerts if channel already exists
  3) socket io listening -> to render new elements

styles.css
-- custom sytling - many classes for JS functionality (hiding and highlighting)
-- incorporated some Google Fonts and Font Awesome

