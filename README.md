# NEF Programs Teacher ID Lookup

## Getting started

1. Clone this repo
1. Ensure parcel is installed globally: `npm install -g parcel-bundler`
1. Run `npm install`
1. Run `npm run start`

## Build for production

1. Run `npm run build`
1. Commit the generated files in the `dist` folder

## Deploy the plugin

1. Use ssh to connect to the server instance
1. `git pull` the plugin

## Use the shortcode

1. Add the shortcode `[nef_programs_teacher_id_lookup version="2"]` where you would like to have the plugin show

```
Note: remove version="2" if you are using the legacy registration suite
```

## Options

- Program ID
  - `[nef_programs_teacher_id_lookup version="2" programId="123"]`
- Job Code
  - `[nef_programs_teacher_id_lookup version="2" programJobCode="abc-xyz"]`
- Year
  - `[nef_programs_teacher_id_lookup version="2" year="2021"]`
- Job Code and Year
  - `[nef_programs_teacher_id_lookup version="2" programJobCode="abc-xyz" year="2021"]`

## Overriding colors

We are using CSS custom properties to allow overriding the default colors. You can use the following in your own CSS.

```
#teacher_id_lookup_container {
	--nef-teacher-lookup-text-color: #4a5568;
    --nef-teacher-lookup-light-color: #a0aec0;
    --nef-teacher-lookup-base-color: #38b2ac;
    --nef-teacher-lookup-accent-color: #ffffff;
    --nef-teacher-lookup-error-color: #ed8936;
}
```
