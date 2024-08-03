document.addEventListener('DOMContentLoaded', function() {
    const songs = [
        {jsonFile: 'json/songData1.json', songBarId: 'songBar1', captionId: 'caption1', sectionsId: 'songSections1'},
        {jsonFile: 'json/songData2.json', songBarId: 'songBar2', captionId: 'caption2', sectionsId: 'songSections2'},
        {jsonFile: 'json/songData3.json', songBarId: 'songBar3', captionId: 'caption3', sectionsId: 'songSections3'},
        {jsonFile: 'json/songData4.json', songBarId: 'songBar4', captionId: 'caption4', sectionsId: 'songSections4'},
        {jsonFile: 'json/songData5.json', songBarId: 'songBar5', captionId: 'caption5', sectionsId: 'songSections5'}
    ];

    songs.forEach(song => {
        fetch(song.jsonFile)
            .then(response => response.json())
            .then(songData => {
                const songBar = document.getElementById(song.songBarId);
                const caption = document.getElementById(song.captionId);
                const sectionsContainer = document.getElementById(song.sectionsId);
                let hoverTimeout;

                // Display global caption initially
                caption.innerText = songData.global.text;
                caption.classList.add('show');

                // Create song segments and section names
                for (const key in songData) {
                    if (key !== 'global') {
                        const segment = document.createElement('div');
                        segment.className = 'segment';
                        const [start, end] = key.split('-');
                        segment.style.flexBasis = `${end - start}%`;
                        segment.dataset.caption = songData[key].text;
                        segment.dataset.start = start;
                        segment.dataset.end = end;

                        const sectionItem = document.createElement('div');
                        sectionItem.className = 'section-item';
                        sectionItem.innerText = songData[key].func;
                        sectionItem.dataset.start = start;
                        sectionItem.dataset.end = end;

                        const highlightSegment = function(start, end, captionText) {
                            clearTimeout(hoverTimeout);
                            caption.innerText = captionText;
                            caption.classList.add('show');

                            // Highlight the corresponding segment in the bar
                            const segments = songBar.getElementsByClassName('segment');
                            Array.from(segments).forEach(seg => {
                                seg.classList.remove('highlight');
                            });
                            Array.from(segments).forEach(seg => {
                                const segStart = parseInt(seg.dataset.start);
                                const segEnd = parseInt(seg.dataset.end);
                                if (segStart == start && segEnd == end) {
                                    seg.classList.add('highlight');
                                }
                            });

                            // Scroll to the segment
                            songBar.scrollLeft = segment.offsetLeft - songBar.offsetLeft;
                        };

                        sectionItem.addEventListener('click', function() {
                            highlightSegment(start, end, segment.dataset.caption);
                        });

                        segment.addEventListener('click', function() {
                            highlightSegment(start, end, segment.dataset.caption);
                        });

                        segment.addEventListener('mouseover', function() {
                            clearTimeout(hoverTimeout);
                            hoverTimeout = setTimeout(() => {
                                caption.innerText = this.dataset.caption;
                                caption.classList.add('show');
                            }, 300); // Add delay before showing caption
                        });

                        segment.addEventListener('mouseout', function() {
                            clearTimeout(hoverTimeout);
                            caption.innerText = songData.global.text;
                            caption.classList.add('show');
                        });

                        songBar.appendChild(segment);
                        sectionsContainer.appendChild(sectionItem);
                    }
                }

                // Restore global caption when clicking outside the song bar
                document.addEventListener('click', function(event) {
                    if (!songBar.contains(event.target) && !sectionsContainer.contains(event.target)) {
                        caption.innerText = songData.global.text;
                        caption.classList.add('show');

                        // Remove highlight from all segments
                        const segments = songBar.getElementsByClassName('segment');
                        Array.from(segments).forEach(seg => {
                            seg.classList.remove('highlight');
                        });
                    }
                });
            })
            .catch(error => console.error('Error loading song data:', error));
    });
});

function copyBibtex() {
    const bibtexCode = document.getElementById('bibtexCode').innerText;
    navigator.clipboard.writeText(bibtexCode).then(() => {
        const copyButton = document.querySelector('.copy-button');
        copyButton.innerText = 'Copied!';
        setTimeout(() => {
            copyButton.innerText = 'Copy';
        }, 4000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });

}
