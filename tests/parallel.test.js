const { convert } = require("../index");
const path = require("path");
const fs = require("fs");

describe("parallel conversion", () => {
  it("should convert 5 documents in parallel", async () => {
    const source = path.join(__dirname, "/resources/hello.docx");

    // Create 5 temporary copies of the source file to avoid output filename collision
    const tempSources = [];
    const tasks = Array.from({ length: 5 }).map(async (_, i) => {
      const tempSource = path.join(__dirname, `/resources/hello_${i}.docx`);
      tempSources.push(tempSource);
      fs.copyFileSync(source, tempSource);
      return await convert(tempSource, "pdf", undefined);
    });

    const results = await Promise.all(tasks);

    expect(results.length).toBe(5);

    // Check that all results are files and exist
    results.forEach((res) => {
      expect(typeof res).toBe("string");
      expect(fs.existsSync(res)).toBe(true);
    });

    // Cleanup
    tempSources.forEach((tempSource) => {
      if (fs.existsSync(tempSource)) fs.unlinkSync(tempSource);
      const output = tempSource.replace(".docx", ".pdf");
      if (fs.existsSync(output)) fs.unlinkSync(output);
    });
  });
});
