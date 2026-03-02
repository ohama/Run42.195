// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="index.html">소개</a></span></li><li class="chapter-item expanded "><li class="part-title">3월 - 시작</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_001.html"><strong aria-hidden="true">1.</strong> 1회: 중학교 첫날, 지옥 같은 버스</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_002.html"><strong aria-hidden="true">2.</strong> 2회: 버스, 매일 이래?</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_003.html"><strong aria-hidden="true">3.</strong> 3회: 버스를 놓쳤다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_004.html"><strong aria-hidden="true">4.</strong> 4회: 걸어서 간 날</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_005.html"><strong aria-hidden="true">5.</strong> 5회: 일부러 걸어봤다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_006.html"><strong aria-hidden="true">6.</strong> 6회: 할아버지</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_007.html"><strong aria-hidden="true">7.</strong> 7회: 비 오는 날</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_008.html"><strong aria-hidden="true">8.</strong> 8회: 엄마의 걱정</a></span></li><li class="chapter-item expanded "><li class="part-title">4월 - 습관</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_009.html"><strong aria-hidden="true">9.</strong> 9회: 4월, 봄이 왔다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_010.html"><strong aria-hidden="true">10.</strong> 10회: 아침의 소리들</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_011.html"><strong aria-hidden="true">11.</strong> 11회: 주 2회 루틴</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_012.html"><strong aria-hidden="true">12.</strong> 12회: 할아버지의 감귤</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_013.html"><strong aria-hidden="true">13.</strong> 13회: 걷기가 당연해졌다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_014.html"><strong aria-hidden="true">14.</strong> 14회: 시간이 아깝지 않아</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_015.html"><strong aria-hidden="true">15.</strong> 15회: 체육 시간</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_016.html"><strong aria-hidden="true">16.</strong> 16회: 봄비</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_017.html"><strong aria-hidden="true">17.</strong> 17회: 엄마가 이해하기 시작했다</a></span></li><li class="chapter-item expanded "><li class="part-title">5월 - 뛰기의 시작</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_018.html"><strong aria-hidden="true">18.</strong> 18회: 5월의 아침</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_019.html"><strong aria-hidden="true">19.</strong> 19회: 뛰어봤다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_020.html"><strong aria-hidden="true">20.</strong> 20회: 달리기가 이렇게 좋은 거였어?</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_021.html"><strong aria-hidden="true">21.</strong> 21회: 민서의 말</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_022.html"><strong aria-hidden="true">22.</strong> 22회: 달려서 등교</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_023.html"><strong aria-hidden="true">23.</strong> 23회: 실패</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_024.html"><strong aria-hidden="true">24.</strong> 24회: 운동화가 불편해</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_025.html"><strong aria-hidden="true">25.</strong> 25회: 할아버지의 응원</a></span></li><li class="chapter-item expanded "><li class="part-title">6월 - 본격 달리기</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_026.html"><strong aria-hidden="true">26.</strong> 26회: 러닝화의 마법</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_027.html"><strong aria-hidden="true">27.</strong> 27회: 장마가 시작됐다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_028.html"><strong aria-hidden="true">28.</strong> 28회: 빗속을 달리다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_029.html"><strong aria-hidden="true">29.</strong> 29회: 5km 논스톱</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_030.html"><strong aria-hidden="true">30.</strong> 30회: 선생님의 관심</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_031.html"><strong aria-hidden="true">31.</strong> 31회: 여름이 오고 있다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_032.html"><strong aria-hidden="true">32.</strong> 32회: 땀</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_033.html"><strong aria-hidden="true">33.</strong> 33회: 민서 같이 달릴래?</a></span></li><li class="chapter-item expanded "><li class="part-title">7월 - 시련</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_034.html"><strong aria-hidden="true">34.</strong> 34회: 7월의 폭염</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_035.html"><strong aria-hidden="true">35.</strong> 35회: 더위와의 싸움</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_036.html"><strong aria-hidden="true">36.</strong> 36회: 태풍이 온다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_037.html"><strong aria-hidden="true">37.</strong> 37회: 못 달린 지 3일</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_038.html"><strong aria-hidden="true">38.</strong> 38회: 태풍이 지나고</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_039.html"><strong aria-hidden="true">39.</strong> 39회: 왜 달리는 거지?</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_040.html"><strong aria-hidden="true">40.</strong> 40회: 다시 버스를 탔다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_041.html"><strong aria-hidden="true">41.</strong> 41회: 슬럼프 탈출</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_042.html"><strong aria-hidden="true">42.</strong> 42회: 여름방학이 시작됐다</a></span></li><li class="chapter-item expanded "><li class="part-title">8월 - 성장</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_043.html"><strong aria-hidden="true">43.</strong> 43회: 방학 아침 루틴</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_044.html"><strong aria-hidden="true">44.</strong> 44회: 7km가 쉬워졌다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_045.html"><strong aria-hidden="true">45.</strong> 45회: 10km 도전</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_046.html"><strong aria-hidden="true">46.</strong> 46회: 민서와 함께</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_047.html"><strong aria-hidden="true">47.</strong> 47회: 광복절 아침</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_048.html"><strong aria-hidden="true">48.</strong> 48회: 마라톤 대회가 있대</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_049.html"><strong aria-hidden="true">49.</strong> 49회: 10km 대회 신청</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_050.html"><strong aria-hidden="true">50.</strong> 50회: 2학기가 시작된다</a></span></li><li class="chapter-item expanded "><li class="part-title">9월 - 목표</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_051.html"><strong aria-hidden="true">51.</strong> 51회: 2학기 첫날</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_052.html"><strong aria-hidden="true">52.</strong> 52회: 대회 D-30</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_053.html"><strong aria-hidden="true">53.</strong> 53회: 가을이 왔다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_054.html"><strong aria-hidden="true">54.</strong> 54회: 억새밭을 지나며</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_055.html"><strong aria-hidden="true">55.</strong> 55회: 아빠의 관심</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_056.html"><strong aria-hidden="true">56.</strong> 56회: 페이스 조절</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_057.html"><strong aria-hidden="true">57.</strong> 57회: 10km 연습</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_058.html"><strong aria-hidden="true">58.</strong> 58회: D-7</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_059.html"><strong aria-hidden="true">59.</strong> 59회: 컨디션 조절</a></span></li><li class="chapter-item expanded "><li class="part-title">10월 - 첫 대회</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_060.html"><strong aria-hidden="true">60.</strong> 60회: 개천절, 내일이 대회</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_061.html"><strong aria-hidden="true">61.</strong> 61회: 첫 대회 완주</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_062.html"><strong aria-hidden="true">62.</strong> 62회: 완주 메달</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_063.html"><strong aria-hidden="true">63.</strong> 63회: 새로운 목표</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_064.html"><strong aria-hidden="true">64.</strong> 64회: 감귤 수확철</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_065.html"><strong aria-hidden="true">65.</strong> 65회: 15km 도전</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_066.html"><strong aria-hidden="true">66.</strong> 66회: 단풍이 들었다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_067.html"><strong aria-hidden="true">67.</strong> 67회: 하프 대회 신청</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_068.html"><strong aria-hidden="true">68.</strong> 68회: 17km 롱런</a></span></li><li class="chapter-item expanded "><li class="part-title">11월 - 하프마라톤</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_069.html"><strong aria-hidden="true">69.</strong> 69회: D-20</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_070.html"><strong aria-hidden="true">70.</strong> 70회: 민서의 응원</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_071.html"><strong aria-hidden="true">71.</strong> 71회: 12km 조정 러닝</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_072.html"><strong aria-hidden="true">72.</strong> 72회: 긴장되기 시작했다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_073.html"><strong aria-hidden="true">73.</strong> 73회: 대회 주간</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_074.html"><strong aria-hidden="true">74.</strong> 74회: 마지막 러닝</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_075.html"><strong aria-hidden="true">75.</strong> 75회: 하프마라톤 완주</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_076.html"><strong aria-hidden="true">76.</strong> 76회: 회복</a></span></li><li class="chapter-item expanded "><li class="part-title">12월 - 새로운 결심</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_077.html"><strong aria-hidden="true">77.</strong> 77회: 다시 뛰기 시작</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_078.html"><strong aria-hidden="true">78.</strong> 78회: 겨울 달리기</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_079.html"><strong aria-hidden="true">79.</strong> 79회: 풀코스 결심</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_080.html"><strong aria-hidden="true">80.</strong> 80회: 훈련 계획</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_081.html"><strong aria-hidden="true">81.</strong> 81회: 15km 롱런</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_082.html"><strong aria-hidden="true">82.</strong> 82회: 연말</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_083.html"><strong aria-hidden="true">83.</strong> 83회: 겨울방학 시작</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_084.html"><strong aria-hidden="true">84.</strong> 84회: 크리스마스 다음 날</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_085.html"><strong aria-hidden="true">85.</strong> 85회: 2024년 마지막 러닝</a></span></li><li class="chapter-item expanded "><li class="part-title">1월 - 풀코스 준비</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_086.html"><strong aria-hidden="true">86.</strong> 86회: 새해 첫 러닝</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_087.html"><strong aria-hidden="true">87.</strong> 87회: 2학년이 다가온다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_088.html"><strong aria-hidden="true">88.</strong> 88회: 25km 도전</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_089.html"><strong aria-hidden="true">89.</strong> 89회: 2학년 첫날</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_090.html"><strong aria-hidden="true">90.</strong> 90회: 회복의 중요성</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_091.html"><strong aria-hidden="true">91.</strong> 91회: 30km 도전</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_092.html"><strong aria-hidden="true">92.</strong> 92회: 설 연휴</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_093.html"><strong aria-hidden="true">93.</strong> 93회: D-34</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_094.html"><strong aria-hidden="true">94.</strong> 94회: 마지막 롱런 25km</a></span></li><li class="chapter-item expanded "><li class="part-title">2월 - 테이퍼링</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_095.html"><strong aria-hidden="true">95.</strong> 95회: 2월이 시작됐다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_096.html"><strong aria-hidden="true">96.</strong> 96회: 1년 전을 생각하다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_097.html"><strong aria-hidden="true">97.</strong> 97회: 유채꽃이 피기 시작했다</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_098.html"><strong aria-hidden="true">98.</strong> 98회: D-17</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_099.html"><strong aria-hidden="true">99.</strong> 99회: 2주 전</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_100.html"><strong aria-hidden="true">100.</strong> 100회: 1주일 전</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_101.html"><strong aria-hidden="true">101.</strong> 101회: 대회 주간</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_102.html"><strong aria-hidden="true">102.</strong> 102회: 마지막 러닝</a></span></li><li class="chapter-item expanded "><li class="part-title">3월 - 완주</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_103.html"><strong aria-hidden="true">103.</strong> 103회: 내일이 대회</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="scenes/entry_104.html"><strong aria-hidden="true">104.</strong> 104회: 42.195km</a></span></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

