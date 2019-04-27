## Notes

### Fourth submission

> Thanks, please do not comment out examples and try to create a more 
useful example than in your addPmToolbar.Rd.

I removed the comments from the examples except for the ones describing the purpose
of the example.  I added one more example demonstrating "leafpm" working with
holes, which is one of the primary reasons for its existence.

### Third submission

> If there are references describing the methods in your package, please 
add these in the Description field of your DESCRIPTION file in the form
authors (year) <doi:...>
authors (year) <arXiv:...>
authors (year, ISBN:...)
with no space after 'doi:', 'arXiv:' and angle brackets for auto-linking.

Unfortunately, there are no references to include regarding this package.

> Please provide small executable examples in your Rd files to
illustrate the use of the exported function but also enable automatic
testing.

Wrapped examples in if(interactive()) rather than \dontrun{}.  Since all exported functions
crete htmlwidgets or Shiny apps that open in RStudio viewer or browser, I don't know 
what else to do.

### Second submission

>   Possibly mis-spelled words in DESCRIPTION:
     exisitng (8:45)

Sorry for mis-spelling.  It has been corrected.  Thanks!

## Test environments
* local Windows 10 install, R 3.4.0
* winbuilder
* ubuntu 14.04.5 LTS (on travis-ci), R 3.5.0
* rhub check_for_cran

## R CMD check results

0 errors | 0 warnings | 2 notes

* checking CRAN incoming feasibility ... NOTE
Maintainer: 'Kenton Russell <kent.russell@timelyportfolio.com>'

New submission

* checking package dependencies ... NOTE
Packages which this enhances but not available for checking:
  'geojsonio', 'mapedit', 'mapview'

## Reverse dependencies

None
