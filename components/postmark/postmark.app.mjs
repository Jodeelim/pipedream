import axios from "axios";

export default {
  type: "app",
  app: "postmark",
  propDefinitions: {
    from_email: {
      type: "string",
      label: "\"From\" email address",
      description:
        "The sender email address. Must have a registered and confirmed Sender Signature. To include a name, use the format 'Full Name &lt;sender@domain.com&gt;' for the address.",
    },
    to_email: {
      type: "string",
      label: "Recipient email address(es)",
      description:
        "Recipient email address. Multiple addresses are comma separated. Max 50.",
    },
    cc_email: {
      type: "string",
      label: "CC email address(es)",
      description:
        "Cc recipient email address. Multiple addresses are comma separated. Max 50.",
      optional: true,
    },
    bcc_email: {
      type: "string",
      label: "BCC email address(es)",
      description:
        "Bcc recipient email address. Multiple addresses are comma separated. Max 50.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description:
        "Email tag that allows you to categorize outgoing emails and get detailed statistics.",
      optional: true,
    },
    reply_to: {
      type: "string",
      label: "\"Reply To\" email address",
      description:
        "Reply To override email address. Defaults to the Reply To set in the sender signature.",
      optional: true,
    },
    custom_headers: {
      type: "string[]",
      label: "Custom Headers",
      description: "List of custom headers to include.",
      optional: true,
    },
    track_opens: {
      type: "boolean",
      label: "Track Opens",
      description: "Activate open tracking for this email.",
      optional: true,
    },
    track_links: {
      type: "string",
      label: "Track Links",
      description:
        "Activate link tracking for links in the HTML or Text bodies of this email.",
      optional: true,
      options: [
        "None",
        "HtmlAndText",
        "HtmlOnly",
        "TextOnly",
      ],
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: `Each attachment should be a string with the parameters separated by a pipe character \`|\`, in the format: \`Name|Content|ContentType\`. Alternatively, you can pass a string representing an object. All three parameters are required:
      \\
      \\
      \`Name\` - the filename with extension, i.e. \`readme.txt\`
      \\
      \`Content\` - the base64-encoded string with the binary data for the file, i.e. \`dGVzdCBjb250ZW50\`
      \\
      \`ContentType\` - the MIME content type, i.e. \`text/plain\`
      \\
      \\
      Example with pipe-separated parameters: \`readme.txt|dGVzdCBjb250ZW50|text/plain\`
      \\
      Example with JSON-stringified object: \`{"Name":"readme.txt","Content":"dGVzdCBjb250ZW50","ContentType":"text/plain"}\`
      `,
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata key/value pairs.",
      optional: true,
    },
    message_stream: {
      type: "string",
      label: "Message stream",
      description:
        "Set message stream ID that's used for sending. If not provided, message will default to the outbound transactional stream.",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async listTemplates() {
      return await axios({
        url: "https://api.postmarkapp.com/templates?count=500&offset=0",
        headers: {
          "X-Postmark-Server-Token": `${this.postmark.$auth.api_key}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then(({ data }) =>
          data.TotalCount
            ? data.Templates.filter(
              (obj) => obj.TemplateType === "Standard",
            ).map((obj) => {
              return {
                label: obj.Name,
                value: obj.Alias,
              };
            })
            : [
              {
                label:
                    "No templates found for this Postmark account. Create a template, then refresh this field.",
                value: -1,
              },
            ])
        .catch(() => [
          {
            label:
              "An error ocurred while fetching the list of templates for this Postmark account. Please try again.",
            value: -2,
          },
        ]);
    },
    listSharedProps() {
      return [
        "from_email",
        "to_email",
        "cc_email",
        "bcc_email",
        "tag",
        "reply_to",
        "custom_headers",
        "track_opens",
        "track_links",
        "attachments",
        "metadata",
        "message_stream",
      ];
    },
    getSharedPropDefinitions() {
      const SHARED_PROPS = this.listSharedProps();

      let obj = {};
      SHARED_PROPS.forEach((propName) => {
        obj[propName] = {
          propDefinition: [
            this,
            propName,
          ],
        };
      });
      return obj;
    },
  },
};
