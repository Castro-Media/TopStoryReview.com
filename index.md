---
layout: default
title: World News
---

<div markdown="0">

<div id="controls">
    <!-- a clickable gear button that opens/collapses a div containing controls for the feed -->
    <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#controls-collapse" aria-expanded="false" aria-controls="controls-collapse">
        <i class="fas fa-gear"></i>
    </button>
    <div class="collapse" id="controls-collapse">
        <!--- radio buttons for Show stories from 1h, 24h, 1d -->
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
            Show stories from:
            <label class="btn btn-secondary">
                <input type="radio" name="period" id="option1" autocomplete="off"> 1h
            </label>
            <label class="btn btn-secondary active">
                <input type="radio" name="period" id="option2" autocomplete="off" checked> 24h
            </label>
            <label class="btn btn-secondary">
                <input type="radio" name="period" id="option3" autocomplete="off"> 7d
            </label>
        </div>
        <!--- radio buttons for Show All, Show Top -->
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-secondary">
                <input type="radio" name="view" id="option4" autocomplete="off"> Show All
            </label>
            <label class="btn btn-secondary active">
                <input type="radio" name="view" id="option5" autocomplete="off" checked> Show Top
            </label>
        </div>
    </div>
</div>

<div class="byline small text-muted">List updated <span class="datetime">2025-07-23 22:28 UTC</span>.</div>

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
