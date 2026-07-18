---
layout: default
title: World News
---

<div markdown="0">

<section id="controls" aria-label="Story filters">
    <fieldset class="control-group">
        <legend>Show stories from</legend>
        <label><input type="radio" name="period" value="1h"> 1 hour</label>
        <label><input type="radio" name="period" value="24h" checked> 24 hours</label>
        <label><input type="radio" name="period" value="7d"> 7 days</label>
    </fieldset>
    <fieldset class="control-group">
        <legend>Show</legend>
        <label><input type="radio" name="view" value="top" checked> Top stories</label>
        <label><input type="radio" name="view" value="all"> All stories</label>
    </fieldset>
</section>

<div class="byline small text-muted">List updated <span class="datetime">{TIME}</span>.</div>

<p>Every aspect of this analysis and app are running in github and completely open source.
Check out the <a href="https://github.com/Castro-Media/Analysis">analysis</a> and
<a href="https://github.com/Castro-Media/TopStoryReview.com">presentation</a> repos.</p>
<div id="top1h" class="col-12">
    <h2>Top 1h</h2>
    <ul>
        {TOP1H}
    </ul>
</div>

<div id="top24h" class="col-12">
    <h2>Top 24h</h2>
    <ul>
        {TOP24H}
    </ul>
</div>

<div id="top7d" class="col-12">
    <h2>Top 7d</h2>
    <ul>
        {TOP7D}
    </ul>
</div>

<div id="all1h" class="col-12">
    <h2>All 1h</h2>
    <ul>
        {ALL1H}
    </ul>
</div>

<div id="all24h" class="col-12">
    <h2>All 24h</h2>
    <ul>
        {ALL24H}
    </ul>
</div>

<div id="all7d" class="col-12">
    <h2>All 7d</h2>
    <ul>
        {ALL7D}
    </ul>
</div>
</div>
