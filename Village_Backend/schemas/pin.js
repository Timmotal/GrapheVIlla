export default { // we are exporting a pin object
    name: 'pin',
    title: 'Pin',
    type: 'document',
    fields: [
        {
            name: 'title', 
            title: 'Title',
            type: 'string',
        },
        {
            name: 'about',
            title: 'About',
            type: 'string',
        },
        {
            name: 'destination',
            title: 'Destination',
            type: 'url',
        }, //stopped at (16"46)
        {
            name: 'category',
            title: 'Category',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image', //another typo from me, (string)
            options: {
                hotspot: true
            }
        },
        {
            name: 'userId',
            title: 'UserId',
            type: 'string',
        },
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy',
        },
        {
            name: 'save',
            title: 'Save',
            type: 'array',
            of: [{ type: 'save'}]
        },
        {
            name: 'comments',// this went to give me a bug 3 hours 54 mins into the video, or maybe not
            title: 'Comments',
            type: 'array',
            of: [{ type: 'comment'}] // so i made a typo here, had some bugs
        },// (20:31)
    ]
}