---
layout: default
title: World News
---

<div markdown="0">

<div id="controls">
    <!-- Radio buttons for selecting the time period: 1h, 24h, 7d -->
    <div id="controlsPeriod">
        <label>
            <input type="radio" name="time-period" value="1h" checked> 1h
        </label>
        <label>
            <input type="radio" name="time-period" value="24h"> 24h
        </label>
        <label>
            <input type="radio" name="time-period" value="7d"> 7d
        </label>
    </div>
    <!-- Radio buttons for selecting all stories or only top stories -->
    <div id="controlsType">
        <label>
            <input type="radio" name="story-type" value="all" checked> Show All Stories
        </label>
        <label>
            <input type="radio" name="story-type" value="top"> Show Only Top Stories
        </label>
    </div>
</div>

<div class="byline small text-muted">List updated <span class="datetime">{TIME}</span>.</div>

<p>Every aspect of this analysis and app are running in github and completely open source.
Check out the <a href="https://github.com/Castro-Media/Analysis">analysis</a> and
<a href="https://github.com/Castro-Media/TopStoryReview.com">presentation</a> repos.</p>
<ul>
{LIST}
</ul>
</div>
