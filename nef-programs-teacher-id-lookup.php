<?php

/**
 * @link              https://nef1.org
 * @since             1.0.0
 * @package           NEF_Programs_Teacher_ID_Lookup
 *
 * @wordpress-plugin
 * Plugin Name:       NEF Programs Teacher ID Lookup
 * Plugin URI:        https://nef1.org
 * Description:       Adds a shortcode to look up teacher IDs by school
 * Version:           1.0.0
 * Author:            Michael Bonner
 * Author URI:        https://bootpackdigital.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       nef-programs-teacher-id-lookup
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}


add_shortcode('nef_programs_teacher_id_lookup', function () {
    wp_enqueue_script('nef_programs_teacher_id_lookup', plugins_url('dist/nef-programs-teacher-id-lookup.e31bb0bc.js', __FILE__), [], '', true);
?>
    <div id="NEF_Programs_Teacher_ID_Lookup_app">Loading...</div>
<?php
});
