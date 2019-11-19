<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kenzap_timetable_list_init() {
    $locale = is_admin() && function_exists( 'get_user_locale' ) ? get_user_locale() : get_locale();
    $locale = apply_filters( 'plugin_locale', $locale, 'kenzap-timetable' );

    unload_textdomain( 'kenzap-timetable' );
    load_textdomain( 'kenzap-timetable', __DIR__ . '/languages/kenzap-timetable-' . $locale . '.mo' );
    load_plugin_textdomain( 'kenzap-timetable', false, __DIR__ . '/languages' );
}
add_action( 'init', 'kenzap_timetable_list_init' );

//Load body class
function kenzap_timetable_list_body_class( $classes ) {

	if ( is_array($classes) ){ $classes[] = 'kenzap'; }else{ $classes.=' kenzap'; }
	return $classes;
}
add_filter( 'body_class', 'kenzap_timetable_list_body_class' );
add_filter( 'admin_body_class', 'kenzap_timetable_list_body_class' );

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function kenzap_timetable_list_block_assets() {
	// Styles.
	wp_enqueue_style(
		'kenzap_timetable_list_style-css',
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ),
		array()
	);

}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'kenzap_timetable_list_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function kenzap_timetable_list_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'kenzap-timetable', // Handle.
		plugins_url( 'dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
        array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-editor' ), // Dependencies, defined above.
        // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'kenzap-timetable', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
    );
    
    // This is only available in WP5.
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'kenzap-timetable', 'kenzap-timetable', KENZAP_TIMETABLE . '/languages/' );
	}

	$pathToPlugin = plugins_url( 'dist/', dirname( __FILE__ ) );
    wp_add_inline_script( 'wp-blocks', 'var kenzap_timetable_gutenberg_path = "' .$pathToPlugin.'"', 'before');
} // End function kenzap_feature_list_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'kenzap_timetable_list_editor_assets' );

function kenzap_timetable_add_specific_features( $post_object ) {
    if(!function_exists('has_blocks') || !function_exists('parse_blocks'))
        return;

    if ( has_blocks( $post_object ) ) {
        $pathToPlugin = plugins_url( 'dist/', dirname( __FILE__ ) );
        $blocks = parse_blocks( $post_object ->post_content );
        foreach ($blocks as $block) {
            if ( $block['blockName'] == 'kenzap/timetable-2' ) {
                wp_register_script( 'owl-carousel', $pathToPlugin . 'owl-carousel/owl-carousel.js');
                wp_enqueue_script( 'owl-carousel' );
                wp_register_style('owl-carousel', $pathToPlugin.'owl-carousel/owl-carousel.css');
                wp_enqueue_style( 'owl-carousel');
            }

            if ($block['blockName'] == 'kenzap/timetable-1') {
                wp_enqueue_script( 'kenzap/timetable-1', plugins_url( 'timetable-1/script.js', __FILE__ ), array('jquery') );
            }
            if ($block['blockName'] == 'kenzap/timetable-2') {
                wp_enqueue_script( 'kenzap/timetable-2', plugins_url( 'timetable-2/script.js', __FILE__ ), array('jquery') );
            }
        }
    }
}
add_action( 'the_post', 'kenzap_timetable_add_specific_features' );

