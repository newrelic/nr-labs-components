# HelpModal

The Help Modal is an add-on which allows you to embed links directly to your documentation and support channels, leveraging the NR [Modal](https://developer.newrelic.com/components/modal) component.

## props

`isModalOpen`: (required) boolean value indicating if the modal is in open or closed state

`setModalOpen`: (required) function to call to close the modal

`urls`: (required) the set of links to display in the modal. The urls property expects an object containing a key:value mapping of `type:url`. The supported types are: `docs, createIssue, createFeature, createQuestion`.

`ownerBadge`: (optional) use to assign attribution to your nerdpack by including an owner badge. The badge accepts the following properties:

- `style`: inline style for custom styling
- `className`: class name to append to the component
- `logo`: An object consisting of
  - `src`: the URL pointing to the logo image
  - `alt`: the alt text for the image
  - `style`: inline style for custom styling
  - `className`: class name to append to the component
- `blurb`: An object consisting of
  - `text`: use to provide a brief description of the app owner
  - `link`: use to link out to other points of interest
  - `style`: inline style for custom styling
  - `className`: class name to append to the component

## example

This example adds a "Help" button to the New Relic nerdlet action bar, which opens the modal when clicked.

```js
import React, { useState, useEffect } from 'react';
import { nerdlet, Icon } from "nr1"
import { HelpModal } from "@newrelic/nr-labs-components"

const Nerdlet = (props) => {
  // state that controls the open/closed state of the modal
  const [helpModalOpen, setHelpModalOpen] = useState(false)

  // effect to configure the Help button in the nerdlet action bar
  useEffect(() => {
    nerdlet.setConfig({
      actionControls: true,
      actionControlButtons: [
        {
          label: "Help",
          hint: "Quick links to get support",
          type: "primary",
          iconType: Icon.TYPE.INTERFACE__INFO__HELP,
          onClick: () => setHelpModalOpen(true),
        },
      ],
    })
  }, [])

  // for this example, the nerdlet is empty except for the modal component, shown when the Help button is clicked
  return (
    <>
    {helpModalOpen && (
      <HelpModal
        isModalOpen={helpModalOpen}
        setModalOpen={setHelpModalOpen}
        urls={{
          docs: "https://github.com/newrelic/nr-labs-components#readme",
          createIssue: "https://github.com/newrelic/nr-labs-components/issues",
          createFeature: "https://github.com/newrelic/nr-labs-components/issues",
          createQuestion: "https://github.com/newrelic/nr-labs-components/discussions",
        }}
        ownerBadge={{
            logo: {
              style: { height: '20px', paddingRight: '12px' },
              alt: 'New Relic',
              src:
                'https://newrelic.com/themes/custom/erno/assets/mediakit/new_relic_logo_horizontal.svg',
            },
            blurb: {
              text: 'You can build your own New Relic app!',
              link: {
                text: 'Find out how',
                url: 'https://developer.newrelic.com/build-apps',
              },
            }
        }}
      />
    )}
    </>
  )
}

export default Nerdlet
```
