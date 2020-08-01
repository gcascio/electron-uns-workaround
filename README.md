# Workaround for UNS issues with electron AppImages

Electron AppImages don't run on linux system with the user name space (UNS) feature disabled.  
This repo demonstrates a possible workaround by disabling the sandbox of of Chromium if the UNS feature is not available.