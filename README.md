# Ar(G)HLL{L}Tab

A tool to generate Artillery Hell Let Loose Lookup Tables.

Ar(G)HLL{L}Tab is a tool to generate, display and visualize Hell Let Loose artillery distances allowing for quick manual lookups without the need to Alt+Tab out of the game or install voice command software. 

# Table of Contents
- How to use
- Prefabricated setups
    - What are they
    - Create one yourself
- Customizing the table
- Documentation

## How to use

First of download this repository, extract the `.zip` and open the resulting folder.

Next you have two possibilities either create your own `prefabricated setup` (short `prefab`) or use an already existing one found inside the `prefabs` folder.

To create your own `prefab` please read through the section `Create one yourself` found under `Prefabricated setups`.

Incase you don't want to create your own `prefab` simple choose an existing one from the `prefabs` folder. 

Once you have choosen your `prefab`, open the `index.html` file inside which contains all the necessary source code and references. Once you open the `index.html` file a broswer window should appear revealing the lookup table. **Tip:** You can just take a screenshot (*Win+Shit+S*) of the website and use that to more easily access the table.

## Prefabricated setups

### What are they

`Prefabricated setups` short `prefabs` are self-contained `Ar(G)HLL{L}Tab`s which change various aspects of the raw version. This could range from slight changes like changing the font to completely revamping the display of the table.

This repository already includes a few `prefabs` inside the `prefabs` folder which can easily be downloaded and used without the need to create one yourself. If you however plan to use this tool for a longer time span and know even just a little about *CSS* I strongly recommend to take just a little bit of your time to customize an `Ar(G)HLL{L}Tab` yourself or ask a friend as it is always better to have one cut exactly to your needs and screen size.

### Create one yourself

To create a `prefab` yourself choose any other `prefab` or the raw version found inside the `src` folder and simple change any of its aspects. To get a clearer understanding of the program read through the `Documentation` section below. After you are done you might want to publish your `prefab` if so rename your `prefab` folder to the following format `{prefab-name}-{author}-{screen-size}` if your prefab is made for a specific screen size use `{screen-width}x{screen-height}` otherwise leave it out. Afterwards just create a new branch and submit a merge request.

*PS: Don't forget to change the author name at the bottom right of the screen.*

## Documentation

### General

Ar(G)HLL{L}Tab works by first generating data using the `generateData` function which uses the settings provided in the settings at the bottom of the javascript file. Afterwards it builds the page using the functions found inside the `Generator` section which intern use the templates inside the `Templates` section. 

### Settings

At the bottom of the javascript exists a settings variable which contains a handful of settings to customise the table. Read the documentation inside the file for more information.

### Generated data

Below is a visualisation of the data returned by the `generateData` function.

```javascript
{
    // contains a list of subsection
    sectionName: [
        // contains a list of lines
        [
            {
                // the distance at which this line starts at
                start: startDistance,

                // the distance at which this line ends at
                end: endDistance,

                // a list of constants each calculated using different constants for different factions
                constants: 
                [
                    // a list of points
                    [
                        {
                            // the mil this point includes
                            mil: mil,

                            // the length this point covers
                            distance: distance
                        }
                    ]
                ]
            }
        ]
    ]
}
```

### Generated DOM

The generated DOM is highly nested (a documentation is at the moment not worth it I will make one later) but not obfuscated so I recommend to just "have a look". The only thing worth mentioning is the fact that each point line is assigned a number starting at 0. It itself counts up internally the same way to allow for unique colors for every constant and point of each MIL inside that point.
