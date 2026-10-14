#!/usr/bin/env python3
"""Add a clean inset border to every existing PDF page without changing its layout."""
import sys
from PyPDF2 import PdfReader, PdfWriter
from PyPDF2._page import PageObject
from PyPDF2.generic import DecodedStreamObject, DictionaryObject, NameObject

source, destination = sys.argv[1], sys.argv[2]
reader = PdfReader(source)
writer = PdfWriter()

total_pages = len(reader.pages)

for page_number, page in enumerate(reader.pages, start=1):
    width = float(page.mediabox.width)
    height = float(page.mediabox.height)
    inset = 18
    overlay = PageObject.create_blank_page(width=width, height=height)
    font = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/Type1"),
        NameObject("/BaseFont"): NameObject("/Helvetica"),
    })
    overlay[NameObject("/Resources")] = DictionaryObject({
        NameObject("/Font"): DictionaryObject({NameObject("/F1"): font})
    })
    page_text = f"Page {page_number} of {total_pages}"
    text_x = (width / 2) - (len(page_text) * 2.2)
    commands = f"q\n0 0 0 RG\n0.8 w\n{inset} {inset} {width - (2 * inset)} {height - (2 * inset)} re S\nQ\nBT\n/F1 8.5 Tf\n0 g\n{text_x:.2f} 26 Td\n({page_text}) Tj\nET\n"
    stream = DecodedStreamObject()
    stream.set_data(commands.encode("ascii"))
    overlay[NameObject("/Contents")] = stream
    page.merge_page(overlay)
    writer.add_page(page)

with open(destination, "wb") as output:
    writer.write(output)
