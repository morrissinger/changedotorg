Integrate a form with Change.org
================================

If you want to have people sign a Change.org petition right on your own website,
it might be helpful to use JavaScript to process the form results. This jQuery
plugin allows you to do that.

Simply include changedotorg.js on the page where your form is, set a few data
attributes on your form element (see the examples), and then write a server-side
to process the form results.

You could probably process form results in a variety of languages, but PHP is
included here because its what Change.org offers as an example, and PHP powers
some of the most popular CMSes out there.

You'll need to use a server-side script like one of the examples because
Change.org requires an API secret, and sending that to the client, unencrypted
would be a big no-no.