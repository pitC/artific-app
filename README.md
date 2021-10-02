# artific.app
Artific is a free personal art recommendation tool.
We recommend you artworks matching your color scheme and taste, let you preview them on your wall with augmented reality and share and / or download them in a high-resolution in order to print at a local print shop.
For some artworks you can even order a high-quality print with one click!
Originally the project was created as part of the Coding da Vinci, a German hackathon for open cultural data, winning the ["Everybody's darling" prize](https://codingdavinci.de/projects/2018_rm/Artific.html).
Sadly, the application is offline at the moment and this repository is an attempt to revive project and redisgn it to a serverless solution based on AWS. The original code is still available [here](https://github.com/pitC/digital_art_consultant).

# How does Artific work?

This is where it gets interesting...

Artific is web-application, which means it pretty much offers you the same functionality as an app would do, but you do not have to install it on your phone and everybody can access it through their browser. We are taking the metadata provided by museums and scan it in order to supplement it with further information on the colours in the artworks. Then we need your input. One way to do it is for you to make a photo, which we scan as well in order to find information on the colours, or you provide us directly with three colours.
<br/><br/>
![UI user input](https://github.com/pitC/artific-app/blob/53fd327ddf6d485beb14bdc52f8145fdd5d79f2c/doc/ui-screen-1.png)
<br/><br/>
Either way, we match your chosen colours with the colours in the painting (this is where the magic – and the math – happens) and recommend you five paintings. The algorithm for the colour matching was written by us. It basically counts how near to one another the desired colours are and the colours in the paintings based on a Delta-E-Formula and the 60-30-10 rule. In the photo you provided we are looking for the main colour, the secondary colour and the contrast colour (we use the vibrant.JS library for that). Then we are trying to match an artwork which has 60% of the desired vibrant colour, 30% of the desired secondary colour and 10% of your apartment’s main colour. This way we hope to achieve an effect pleasing to the human eye.
<br/><br/>
![UI results](https://github.com/pitC/artific-app/blob/53fd327ddf6d485beb14bdc52f8145fdd5d79f2c/doc/ui-screen-2.png)
<br/><br/>
Another way to find an artwork is to click on “Discover". Here we ask you a couple of questions and match your answer to the provided metadata records about an artwork, for example the subject, the genre, the atmosphere etc. For each question and each answer we use different metadata records.

Once you chose an artwork, you can preview it on your wall with augmented reality, which is really nice. For that feature we used the A-Frame library.



# Original architecture
Originally the system was a web application hosted on Heroku.
![Original architecture](https://github.com/pitC/artific-app/blob/6416eddbbc899f36a47fdea1e91208cfa3b6547e/doc/architecture-Original.svg)

# Target architecture
In the target architecture the backend gets rebuilt to make use of serverless services provided by AWS. This enables to cut the costs virtually to zero while keeping the application still online.
![AWS serverless architecture](https://github.com/pitC/artific-app/blob/53f34a3389fe0fff011f8cdc928596ac13a84ef4/doc/architecture-AWS.drawio.svg)
