## LMT preview update 2021-02-25

The following changes are being made to the LMT Web Tools:

1. All of the URNs were changed
  * from `urn:smpte:register:`
  * to URLs of the form: `prefix/code` where `prefix` has the non-approved value of `https://smpte-ra.org/register/lmt/id`
    * e.g.  `https://smpte-ra.org/register/lmt/code/en-au` for Australian English
2. Canonical form changed to `JSON` from `XML`
3. New SMPTE logo
4. update to control document to reflect url change
5. Modified SMPTE XML to facilitate machine processing
6. Plugin conversion tool archicture to allow better IO with contributors
