import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import styles from './PhotoSlider.module.scss';

const AUTO_FLIP_DELAY = 5000;

function PhotoSlider({
    images = [],
    coverImage,
    backgroundImage,
}) {
    /*
     * closed
     * opening
     * open
     * closing
     */
    const [bookState, setBookState] =
        useState('closed');

    /*
     * currentPage = ảnh đang nằm bên phải.
     *
     * 0:
     * [cover back] [image 1]
     *
     * 1:
     * [image 1] [image 2]
     *
     * 2:
     * [image 2] [image 3]
     */
    const [currentPage, setCurrentPage] =
        useState(0);

    /*
     * null
     *
     * hoặc:
     *
     * {
     *   index: number,
     *   direction: 'next' | 'prev'
     * }
     */
    const [turning, setTurning] =
        useState(null);

    const autoTimerRef = useRef(null);

    /*
     * =====================================================
     * HELPERS
     * =====================================================
     */

    const clearAutoTimer =
        useCallback(() => {
            if (!autoTimerRef.current) {
                return;
            }

            clearTimeout(
                autoTimerRef.current,
            );

            autoTimerRef.current = null;
        }, []);

    const isAnimating =
        bookState === 'opening' ||
        bookState === 'closing' ||
        turning !== null;

    const isLastPage =
        images.length === 0 ||
        currentPage >=
            images.length - 1;

    /*
     * =====================================================
     * OPEN BOOK
     * =====================================================
     */

    const openBook = useCallback(() => {
        if (
            bookState !== 'closed' ||
            images.length === 0
        ) {
            return;
        }

        clearAutoTimer();

        setCurrentPage(0);
        setTurning(null);
        setBookState('opening');
    }, [
        bookState,
        images.length,
        clearAutoTimer,
    ]);

    /*
     * =====================================================
     * CLOSE BOOK
     * =====================================================
     */

    const closeBook = useCallback(() => {
        if (
            bookState !== 'open' ||
            currentPage !== 0 ||
            turning !== null
        ) {
            return;
        }

        clearAutoTimer();

        setBookState('closing');
    }, [
        bookState,
        currentPage,
        turning,
        clearAutoTimer,
    ]);

    /*
     * =====================================================
     * COVER TRANSITION END
     * =====================================================
     */

    const handleCoverTransitionEnd =
        useCallback(
            (event) => {
                if (
                    event.target !==
                    event.currentTarget
                ) {
                    return;
                }

                if (
                    event.propertyName !==
                    'transform'
                ) {
                    return;
                }

                if (
                    bookState ===
                    'opening'
                ) {
                    setBookState('open');
                    return;
                }

                if (
                    bookState ===
                    'closing'
                ) {
                    setCurrentPage(0);
                    setTurning(null);
                    setBookState('closed');
                }
            },
            [bookState],
        );

    /*
     * =====================================================
     * NEXT PAGE
     * =====================================================
     */

    const nextPage = useCallback(() => {
        if (
            bookState !== 'open' ||
            turning !== null ||
            currentPage >=
                images.length - 1
        ) {
            return;
        }

        clearAutoTimer();

        /*
         * Ví dụ:
         *
         * [image 2] [image 3]
         *
         * currentPage = 2
         *
         * sheet index 2 chính là image 3
         * đang nằm bên phải.
         *
         * Chính sheet đó sẽ:
         *
         * rotateY(0)
         *      ↓
         * rotateY(-180deg)
         */

        setTurning({
            index: currentPage,
            direction: 'next',
        });

        /*
         * Đổi spread ngay để CSS biết
         * sheet nào chuyển sang trạng thái flipped.
         *
         * Không thay image.
         * Không remount sheet.
         */
        setCurrentPage(
            (prev) => prev + 1,
        );
    }, [
        bookState,
        turning,
        currentPage,
        images.length,
        clearAutoTimer,
    ]);

    /*
     * =====================================================
     * PREVIOUS PAGE
     * =====================================================
     */

    const previousPage =
        useCallback(() => {
            if (
                bookState !== 'open' ||
                turning !== null
            ) {
                return;
            }

            clearAutoTimer();

            /*
             * Spread đầu:
             *
             * [cover back] [image 1]
             *
             * click trái => đóng sách.
             */
            if (currentPage === 0) {
                closeBook();
                return;
            }

            /*
             * QUAN TRỌNG:
             *
             * Không tạo image mới bên phải.
             *
             * Chính sheet đang ở bên trái:
             *
             * rotateY(-180deg)
             *
             * sẽ quay ngược:
             *
             * rotateY(0deg)
             */

            const sheetIndex =
                currentPage - 1;

            setTurning({
                index: sheetIndex,
                direction: 'prev',
            });

            setCurrentPage(
                (prev) => prev - 1,
            );
        }, [
            bookState,
            turning,
            currentPage,
            clearAutoTimer,
            closeBook,
        ]);

    /*
     * =====================================================
     * SHEET TRANSITION END
     * =====================================================
     */

    const handleSheetTransitionEnd =
        useCallback(
            (index, event) => {
                if (
                    event.target !==
                    event.currentTarget
                ) {
                    return;
                }

                if (
                    event.propertyName !==
                    'transform'
                ) {
                    return;
                }

                if (
                    !turning ||
                    turning.index !== index
                ) {
                    return;
                }

                /*
                 * Không commit image.
                 * Không swap page.
                 *
                 * Chỉ kết thúc trạng thái
                 * animation.
                 */
                setTurning(null);
            },
            [turning],
        );

    /*
     * =====================================================
     * AUTOPLAY
     * =====================================================
     */

    useEffect(() => {
        clearAutoTimer();

        if (
            bookState !== 'open' ||
            turning !== null ||
            isLastPage
        ) {
            return;
        }

        autoTimerRef.current =
            setTimeout(() => {
                nextPage();
            }, AUTO_FLIP_DELAY);

        return clearAutoTimer;
    }, [
        bookState,
        currentPage,
        turning,
        isLastPage,
        nextPage,
        clearAutoTimer,
    ]);

    useEffect(() => {
        return () => {
            clearAutoTimer();
        };
    }, [clearAutoTimer]);

    /*
     * =====================================================
     * CLICK
     * =====================================================
     */

    const handleBookClick = (
        event,
    ) => {
        if (isAnimating) {
            return;
        }

        const rect =
            event.currentTarget.getBoundingClientRect();

        const x =
            event.clientX -
            rect.left;

        /*
         * CLOSED
         *
         * Book thực tế vẫn rộng 2 pages.
         *
         * Nhưng right page được đưa vào
         * chính giữa wrapper.
         */
        if (bookState === 'closed') {
            if (
                x >= rect.width / 2
            ) {
                openBook();
            }

            return;
        }

        if (bookState !== 'open') {
            return;
        }

        /*
         * LEFT
         */
        if (x < rect.width / 2) {
            previousPage();
            return;
        }

        /*
         * RIGHT
         */
        if (!isLastPage) {
            nextPage();
        }
    };

    /*
     * =====================================================
     * Z-INDEX STACK
     * =====================================================
     */

    const getSheetZIndex = (
        index,
    ) => {
        /*
         * Sheet đang quay phải nằm
         * trên tất cả sheet khác.
         */
        if (
            turning?.index === index
        ) {
            return 5000;
        }

        /*
         * Các sheet đã sang LEFT.
         *
         * index càng lớn càng nằm trên.
         *
         * Ví dụ:
         *
         * image1
         * image2
         * image3
         *
         * image3 phải nằm trên cùng.
         */
        if (index < currentPage) {
            return 1000 + index;
        }

        /*
         * Các sheet còn ở RIGHT.
         *
         * index nhỏ nhất phải nằm trên.
         *
         * currentPage chính là sheet
         * nhìn thấy.
         */
        return 3000 - index;
    };

    /*
     * =====================================================
     * CLASS
     * =====================================================
     */

    const bookClasses = [
        styles.book,

        bookState === 'closed'
            ? styles.closed
            : '',

        bookState === 'opening'
            ? styles.opening
            : '',

        bookState === 'open'
            ? styles.open
            : '',

        bookState === 'closing'
            ? styles.closing
            : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={styles.wrapper}>
            {/*
             * =============================================
             * 3D AREA
             * =============================================
             *
             * Fake spine KHÔNG nằm trong đây.
             */}

            <div
                className={
                    styles.perspectiveLayer
                }
            >
                <div
                    className={
                        bookClasses
                    }
                    onClick={
                        handleBookClick
                    }
                >
                    {/*
                     * =====================================
                     * COVER
                     * =====================================
                     *
                     * Cover persistent.
                     *
                     * Không mount/unmount mỗi lần mở.
                     */}

                    <div
                        className={
                            styles.coverSheet
                        }
                        onTransitionEnd={
                            handleCoverTransitionEnd
                        }
                    >
                        <div
                            className={[
                                styles.frontFace,
                                styles.coverFrontFace,
                            ].join(' ')}
                        >
                            <CoverPage
                                image={
                                    coverImage
                                }
                            />
                        </div>

                        <div
                            className={[
                                styles.backFace,
                                styles.coverBackFace,
                            ].join(' ')}
                        >
                            <CoverBack />
                        </div>
                    </div>

                    {/*
                     * =====================================
                     * PHOTO SHEETS
                     * =====================================
                     */}

                    {images.map(
                        (
                            image,
                            index,
                        ) => {
                            const isFlipped =
                                index <
                                currentPage;

                            const isTurning =
                                turning
                                    ?.index ===
                                index;

                            return (
                                <div
                                    key={
                                        index
                                    }
                                    className={[
                                        styles.photoSheet,

                                        isFlipped
                                            ? styles.flipped
                                            : '',

                                        isTurning
                                            ? styles.turning
                                            : '',
                                    ]
                                        .filter(
                                            Boolean,
                                        )
                                        .join(
                                            ' ',
                                        )}
                                    style={{
                                        zIndex:
                                            getSheetZIndex(
                                                index,
                                            ),
                                    }}
                                    onTransitionEnd={(
                                        event,
                                    ) =>
                                        handleSheetTransitionEnd(
                                            index,
                                            event,
                                        )
                                    }
                                >
                                    {/*
                                     * RIGHT FACE
                                     */}

                                    <div
                                        className={[
                                            styles.frontFace,
                                            styles.photoFrontFace,
                                        ].join(
                                            ' ',
                                        )}
                                    >
                                        <PhotoPage
                                            image={
                                                image
                                            }
                                            backgroundImage={
                                                backgroundImage
                                            }
                                        />
                                    </div>

                                    {/*
                                     * LEFT FACE
                                     *
                                     * Vẫn cùng image.
                                     *
                                     * Đây là chủ đích:
                                     * page đang ở RIGHT khi
                                     * lật sang LEFT phải vẫn
                                     * là cùng một trang.
                                     */}

                                    <div
                                        className={[
                                            styles.backFace,
                                            styles.photoBackFace,
                                        ].join(
                                            ' ',
                                        )}
                                    >
                                        <PhotoPage
                                            image={
                                                image
                                            }
                                            backgroundImage={
                                                backgroundImage
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            </div>

            {/*
             * =============================================
             * FAKE SPINE
             * =============================================
             *
             * Chỉ render khi book đã mở hoàn toàn.
             *
             * Trong lúc next/previous:
             *
             * bookState vẫn luôn = open
             *
             * => element này không mount/unmount
             * => opacity không đổi
             * => không animation
             * => không tham gia 3D compositor.
             */}

            {bookState === 'open' && (
                <div
                    className={
                        styles.fakeSpine
                    }
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

/*
 * =========================================================
 * COVER
 * =========================================================
 */

function CoverPage({ image }) {
    return (
        <div
            className={
                styles.coverPage
            }
        >
            <img
                src={image}
                alt="Birthday album cover"
                draggable={false}
            />
        </div>
    );
}

/*
 * =========================================================
 * COVER BACK
 * =========================================================
 */

function CoverBack() {
    return (
        <div
            className={
                styles.coverBack
            }
        />
    );
}

/*
 * =========================================================
 * PHOTO
 * =========================================================
 */

function PhotoPage({
    image,
    backgroundImage,
}) {
    if (!image) {
        return (
            <div
                className={
                    styles.emptyPage
                }
            />
        );
    }

    return (
        <div
            className={
                styles.photoPage
            }
        >
            {backgroundImage && (
                <img
                    src={
                        backgroundImage
                    }
                    className={
                        styles.pageBackground
                    }
                    alt=""
                    draggable={
                        false
                    }
                />
            )}

            <div
                className={
                    styles.photoContainer
                }
            >
                <img
                    src={image}
                    className={
                        styles.photo
                    }
                    alt=""
                    draggable={
                        false
                    }
                />
            </div>
        </div>
    );
}

export default PhotoSlider;