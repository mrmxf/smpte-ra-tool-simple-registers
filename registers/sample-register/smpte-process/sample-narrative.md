### Sample Register update 2021-10-18

This narrative is a markdown file that should accompany each update
to a register to give the visitor changelog information and a basic
background to the register.

This Register is just a sample to check that the project works.
You can disable this register by changing its `config.json` so
that the framework ignores it.

To test the conversion tools, paste the data below, select the right tool and off you go.

**YAML sample**

```yaml
---
- uint16: 1
  english: one
  french: un
- uint16: 2
  english: two
  french: deux
- uint16: 3
  english: three
  french: trois
```

**XML Sample**. To make reversible `xml` ⇆ `json`, this is actually `{"root": {"item": smpteJson} }`

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <item>
    <uint16>1</uint16>
    <english>one</english>
    <french>un</french>
  </item>
  <item>
    <uint16>2</uint16>
    <english>two</english>
    <french>deux</french>
  </item>
  <item>
    <uint16>3</uint16>
    <english>three</english>
    <french>trois</french>
  </item>
</root>
```

Status of the sample register:

* `current` version of the register is the reference
* `previous` version of the register demonstrates that `current` has had a new term added
* `candidate` version of the register demonstrates that a new term will be added **and**
  there have been new optional properties added to each term
