<?php

/**
 * @link              https://nef1.org
 * @since             1.0.0
 * @package           NEF_Programs_Teacher_ID_Lookup
 *
 * @wordpress-plugin
 * Plugin Name:       NEF Programs Teacher ID Lookup
 * Plugin URI:        https://nef1.org
 * Description:       Adds a shortcode to look up teacher IDs by school. Use the shortcode <code>[nef_programs_teacher_id_lookup]</code> to embed the plugin. You can also pass programId="123", programJobCode="abc-ta" (or "abc-ta,def-bk" for multiple program job codes), or year="2021" as parameters.
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


add_shortcode(
    'nef_programs_teacher_id_lookup',
    function ($attributes) {
        $programId = !empty($attributes['program_id']) ?
            (int) $attributes['program_id'] :
            '*';
        $programJobCode = !empty($attributes['program_job_code']) ?
            $attributes['program_job_code'] :
            '*';
        $year = !empty($attributes['year']) ?
            (int) $attributes['year'] :
            '*';
        wp_enqueue_script(
            'polyfill_io',
            'https://cdn.polyfill.io/v2/polyfill.min.js',
            [],
            '',
            false
        );
        wp_enqueue_script(
            'nef_programs_teacher_id_lookup',
            plugins_url(
                'dist/teacher-id-lookup.31b6bd86.js',
                __FILE__
            ),
            [],
            '1.01',
            true
        );
        ob_start();
        ?>
    <div id="NEF_Programs_Teacher_ID_Lookup_app" program_id="<?= $programId ?>" year="<?= $year ?>"
        program_job_code="<?= $programJobCode ?>">Loading teacher lookup...</div>
    <?php
        return ob_get_clean();
    }
);


add_action('wp_head', function () {
    echo "<style>
     #NEF_Programs_Teacher_ID_Lookup_app {
        --nef-teacher-lookup-text-color: #4a5568;
        --nef-teacher-lookup-light-color: #a0aec0;
        --nef-teacher-lookup-base-color: #38b2ac;
        --nef-teacher-lookup-accent-color: #ffffff;
        --nef-teacher-lookup-error-color: #ed8936;
      }
      </style>";
});
